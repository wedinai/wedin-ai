import requests
from bs4 import BeautifulSoup
import csv
import time
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

# Categories to scrape
categories = {
    'wedding-bands': 'Wedding Bands',
    'party-bands': 'Party Bands',
    'wedding-djs': 'Wedding DJs',
    'cover-bands': 'Cover Bands',
    'jazz-bands': 'Jazz Bands',
    'acoustic-bands': 'Acoustic Bands',
    'acoustic-duos': 'Acoustic Duos',
    'saxophone-players': 'Saxophone Players',
    'guitarists': 'Guitarists',
    'singing-guitarists': 'Singing Guitarists',
    'pianists': 'Pianists',
    'string-quartets': 'String Quartets',
    'violinists-fiddlers': 'Violinists / Fiddlers',
    'harpists': 'Harpists',
    'wedding-singers': 'Wedding Singers',
    'wedding-musicians': 'Wedding Musicians',
    'wedding-ceremony-musicians': 'Wedding Ceremony Musicians',
    'soul-bands': 'Soul Bands',
    'funk-bands': 'Funk Bands',
    'rock-bands': 'Rock Bands',
    'pop-bands': 'Pop Bands',
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

all_data = []
summary_data = []

def extract_price(text):
    """Extract price from text like 'Book from R3000 (ZAR)' or 'Book from $500 (USD)'"""
    if not text:
        return None, None
    
    zar_match = re.search(r'R(\d[\d,]*)\s*\(ZAR\)', text)
    if zar_match:
        price = zar_match.group(1).replace(',', '')
        return float(price), 'ZAR'
    
    usd_match = re.search(r'\$(\d[\d,]*)\s*\(USD\)', text)
    if usd_match:
        price = usd_match.group(1).replace(',', '')
        return float(price), 'USD'
    
    gbp_match = re.search(r'£(\d[\d,]*)\s*\(GBP\)', text)
    if gbp_match:
        price = gbp_match.group(1).replace(',', '')
        return float(price), 'GBP'
    
    eur_match = re.search(r'€(\d[\d,]*)\s*\(EUR\)', text)
    if eur_match:
        price = eur_match.group(1).replace(',', '')
        return float(price), 'EUR'
    
    return None, None

def extract_summary_prices(soup):
    """Extract the summary low/avg/high prices from the page"""
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

def scrape_page(url, category_name):
    """Scrape a single page of listings"""
    try:
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        listings = []
        
        # Find all listing cards
        cards = soup.find_all('div', class_=re.compile(r'listing-card|search-result|card'))
        
        if not cards:
            # Try alternative approach - find all "Book from" text
            book_texts = soup.find_all(string=re.compile(r'Book from'))
            for bt in book_texts:
                parent = bt.find_parent()
                if parent:
                    price, currency = extract_price(parent.get_text())
                    if price:
                        listings.append({
                            'price': price,
                            'currency': currency,
                        })
        
        return soup, listings
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None, []

def scrape_category(slug, category_name, max_pages=8):
    """Scrape multiple pages of a category"""
    url = base_url.format(slug)
    print(f"\n{'='*60}")
    print(f"Scraping: {category_name} ({slug})")
    print(f"URL: {url}")
    
    try:
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')
    except Exception as e:
        print(f"  Error: {e}")
        return
    
    # Get summary prices
    low, avg, high, total = extract_summary_prices(soup)
    print(f"  Total listings: {total}")
    print(f"  Price range: R{low} - R{high}, Average: R{avg}")
    
    if total:
        summary_data.append({
            'category': category_name,
            'slug': slug,
            'total_listings': total,
            'low_price_zar': low,
            'avg_price_zar': avg,
            'high_price_zar': high,
        })
    
    # Extract individual listings from the page HTML
    page_text = resp.text
    
    # Find all "Book from" prices on this page
    price_pattern = re.compile(r'Book from\s+(R[\d,]+\s*\(ZAR\)|[\$£€][\d,]+\s*\([A-Z]+\)|POA)')
    prices_found = price_pattern.findall(page_text)
    
    # Find listing names - they appear in h3 or specific link patterns
    # Look for listing card structures
    name_pattern = re.compile(r'<a[^>]*class="[^"]*listing-name[^"]*"[^>]*>([^<]+)</a>')
    names_found = name_pattern.findall(page_text)
    
    # Alternative: extract from structured data
    # Find all listing blocks
    listing_blocks = re.findall(
        r'<div class="[^"]*search-result-card[^"]*".*?</div>\s*</div>\s*</div>',
        page_text, re.DOTALL
    )
    
    # Parse individual listings from the full text
    # Look for patterns: name, description, location, reviews, price
    lines = soup.get_text('\n').split('\n')
    
    current_listing = {}
    listing_count = 0
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
        
        # Check for "Book from" price
        if 'Book from' in line:
            price, currency = extract_price(line)
            is_poa = 'POA' in line
            
            # Try to find the name by looking backwards
            name = None
            location = None
            description = None
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
            listing_count += 1
    
    print(f"  Extracted {listing_count} individual listings from page 1")
    
    # Scrape additional pages
    for page_num in range(2, max_pages + 1):
        page_url = f"{url}?page={page_num}"
        print(f"  Scraping page {page_num}...")
        time.sleep(1.5)
        
        try:
            resp = requests.get(page_url, headers=headers, timeout=30)
            if resp.status_code != 200:
                print(f"    Page {page_num} returned {resp.status_code}, stopping.")
                break
            
            soup = BeautifulSoup(resp.text, 'html.parser')
            lines = soup.get_text('\n').split('\n')
            
            page_listing_count = 0
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
                    page_listing_count += 1
            
            print(f"    Found {page_listing_count} listings on page {page_num}")
            
            if page_listing_count == 0:
                break
                
        except Exception as e:
            print(f"    Error on page {page_num}: {e}")
            break
    
    time.sleep(1)

# Run the scraper
print("Starting GigHeaven scraper...")
print(f"Scraping {len(categories)} categories\n")

for slug, name in categories.items():
    scrape_category(slug, name)

# Save summary data
with open('/home/ubuntu/gigheaven_summary.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['category', 'slug', 'total_listings', 'low_price_zar', 'avg_price_zar', 'high_price_zar'])
    writer.writeheader()
    writer.writerows(summary_data)

# Save all individual listing data
with open('/home/ubuntu/gigheaven_listings.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['category', 'price_zar', 'price_usd', 'price_other', 'currency', 'location', 'reviews', 'is_poa'])
    writer.writeheader()
    writer.writerows(all_data)

print(f"\n{'='*60}")
print(f"SCRAPING COMPLETE")
print(f"Summary data: {len(summary_data)} categories")
print(f"Individual listings: {len(all_data)} entries")
print(f"Files saved: gigheaven_summary.csv, gigheaven_listings.csv")
