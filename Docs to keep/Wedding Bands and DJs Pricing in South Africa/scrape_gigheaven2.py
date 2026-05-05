import requests
from bs4 import BeautifulSoup
import csv
import time
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

# Categories that failed or weren't scraped yet
categories = {
    'wedding-djs': 'Wedding DJs',
    'acoustic-bands': 'Acoustic Bands',
    'acoustic-duos': 'Acoustic Duos',
    'saxophone-players': 'Saxophone Players',
    'guitarists': 'Guitarists',
    'pianists': 'Pianists',
    'string-quartets': 'String Quartets',
    'harpists': 'Harpists',
    'wedding-singers': 'Wedding Singers',
    'wedding-musicians': 'Wedding Musicians',
    'wedding-ceremony-musicians': 'Wedding Ceremony Musicians',
    'funk-bands': 'Funk Bands',
    'rock-bands': 'Rock Bands',
    'r-and-b-bands': 'R&B Bands',
    'reggae-ska-bands': 'Reggae / Ska Bands',
    'motown-bands': 'Motown Bands',
    'disco-bands': 'Disco Bands',
    'swing-bands': 'Swing Bands',
    'big-bands': 'Big Bands',
    'blues-bands': 'Blues Bands',
    'gospel-groups': 'Gospel Groups',
    'african-entertainment': 'African Entertainment',
    'mobile-djs': 'Mobile DJs',
    'event-djs': 'Event DJs',
    'club-djs': 'Club DJs',
    'sax-and-dj-live-musician-and-dj': 'Sax & DJ / Live Musician & DJ',
    'one-man-bands': 'One Man Bands',
    'singers-with-backing-tracks': 'Singers With Backing Tracks',
    'singing-pianists': 'Singing Pianists',
    'classical-ensembles': 'Classical Ensembles',
    'classical-guitarists': 'Classical Guitarists',
    'classical-pianists': 'Classical Pianists',
    'cellists': 'Cellists',
    'choirs': 'Choirs',
    'a-cappella-groups': 'A Cappella Groups',
    'tribute-bands': 'Tribute Bands',
}

base_url = 'https://www.gigheaven.com/search/{}/south-africa.html'

summary_data = []
all_data = []

def extract_price(text):
    if not text:
        return None, None
    zar_match = re.search(r'R(\d[\d,]*)\s*\(ZAR\)', text)
    if zar_match:
        return float(zar_match.group(1).replace(',', '')), 'ZAR'
    usd_match = re.search(r'\$(\d[\d,]*)\s*\(USD\)', text)
    if usd_match:
        return float(usd_match.group(1).replace(',', '')), 'USD'
    gbp_match = re.search(r'£(\d[\d,]*)\s*\(GBP\)', text)
    if gbp_match:
        return float(gbp_match.group(1).replace(',', '')), 'GBP'
    eur_match = re.search(r'€(\d[\d,]*)\s*\(EUR\)', text)
    if eur_match:
        return float(eur_match.group(1).replace(',', '')), 'EUR'
    return None, None

def extract_summary_prices(soup):
    text = soup.get_text()
    low = avg = high = None
    low_match = re.search(r'Low Price\s*from\s*R([\d,]+)', text)
    if low_match:
        low = float(low_match.group(1).replace(',', ''))
    avg_match = re.search(r'Average Price\s*from\s*R([\d,]+)', text)
    if avg_match:
        avg = float(avg_match.group(1).replace(',', ''))
    high_match = re.search(r'High Price\s*from\s*R([\d,]+)', text)
    if high_match:
        high = float(high_match.group(1).replace(',', ''))
    total_match = re.search(r'Browse\s+(\d+)', text)
    total = int(total_match.group(1)) if total_match else None
    return low, avg, high, total

def scrape_category(slug, category_name):
    url = base_url.format(slug)
    print(f"\nScraping: {category_name}")
    
    try:
        resp = requests.get(url, headers=headers, timeout=30)
        if resp.status_code == 429:
            print(f"  Rate limited, waiting 30s...")
            time.sleep(30)
            resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')
    except Exception as e:
        print(f"  Error: {e}")
        return False
    
    low, avg, high, total = extract_summary_prices(soup)
    print(f"  Total: {total}, Range: R{low} - R{high}, Avg: R{avg}")
    
    if total or low:
        summary_data.append({
            'category': category_name,
            'slug': slug,
            'total_listings': total,
            'low_price_zar': low,
            'avg_price_zar': avg,
            'high_price_zar': high,
        })
    
    # Extract individual listings
    lines = soup.get_text('\n').split('\n')
    count = 0
    for i, line in enumerate(lines):
        line = line.strip()
        if 'Book from' in line:
            price, currency = extract_price(line)
            is_poa = 'POA' in line
            location = None
            reviews = None
            for j in range(max(0, i-15), i):
                prev_line = lines[j].strip()
                if prev_line and 'South Africa' in prev_line and ',' in prev_line:
                    location = prev_line
                if prev_line and 'review' in prev_line.lower():
                    rev_match = re.search(r'(\d+)\s*review', prev_line)
                    if rev_match:
                        reviews = int(rev_match.group(1))
            all_data.append({
                'category': category_name,
                'price_zar': price if currency == 'ZAR' else None,
                'price_usd': price if currency == 'USD' else None,
                'price_other': price if currency not in ['ZAR', 'USD', None] else None,
                'currency': currency if currency else ('POA' if is_poa else None),
                'location': location,
                'reviews': reviews,
                'is_poa': is_poa,
            })
            count += 1
    
    print(f"  Extracted {count} listings from page 1")
    
    # Get page 2 only
    time.sleep(4)
    try:
        resp2 = requests.get(f"{url}?page=2", headers=headers, timeout=30)
        if resp2.status_code == 200:
            soup2 = BeautifulSoup(resp2.text, 'html.parser')
            lines2 = soup2.get_text('\n').split('\n')
            count2 = 0
            for i, line in enumerate(lines2):
                line = line.strip()
                if 'Book from' in line:
                    price, currency = extract_price(line)
                    is_poa = 'POA' in line
                    location = None
                    reviews = None
                    for j in range(max(0, i-15), i):
                        prev_line = lines2[j].strip()
                        if prev_line and 'South Africa' in prev_line and ',' in prev_line:
                            location = prev_line
                        if prev_line and 'review' in prev_line.lower():
                            rev_match = re.search(r'(\d+)\s*review', prev_line)
                            if rev_match:
                                reviews = int(rev_match.group(1))
                    all_data.append({
                        'category': category_name,
                        'price_zar': price if currency == 'ZAR' else None,
                        'price_usd': price if currency == 'USD' else None,
                        'price_other': price if currency not in ['ZAR', 'USD', None] else None,
                        'currency': currency if currency else ('POA' if is_poa else None),
                        'location': location,
                        'reviews': reviews,
                        'is_poa': is_poa,
                    })
                    count2 += 1
            print(f"  Page 2: {count2} listings")
    except:
        pass
    
    return True

# Run with delays
for slug, name in categories.items():
    success = scrape_category(slug, name)
    time.sleep(5)  # Longer delay between categories

# Save results
with open('/home/ubuntu/gigheaven_summary2.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['category', 'slug', 'total_listings', 'low_price_zar', 'avg_price_zar', 'high_price_zar'])
    writer.writeheader()
    writer.writerows(summary_data)

with open('/home/ubuntu/gigheaven_listings2.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['category', 'price_zar', 'price_usd', 'price_other', 'currency', 'location', 'reviews', 'is_poa'])
    writer.writeheader()
    writer.writerows(all_data)

print(f"\nDONE: {len(summary_data)} categories, {len(all_data)} listings")
