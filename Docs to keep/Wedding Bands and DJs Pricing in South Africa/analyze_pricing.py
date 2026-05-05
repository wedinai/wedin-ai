import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import numpy as np
import os

# Set style
plt.style.use('seaborn-v0_8-whitegrid')
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['figure.dpi'] = 150
plt.rcParams['savefig.bbox'] = 'tight'

output_dir = '/home/ubuntu/output'
os.makedirs(output_dir, exist_ok=True)

# ============================================================
# 1. LOAD AND MERGE GIGHEAVEN DATA
# ============================================================

# Load summary data from both scraper runs
df_summary1 = pd.read_csv('/home/ubuntu/gigheaven_summary.csv')
df_summary2 = pd.read_csv('/home/ubuntu/gigheaven_summary2.csv')
df_summary = pd.concat([df_summary1, df_summary2], ignore_index=True)

# Add Sax & DJ data manually
sax_dj_row = pd.DataFrame([{
    'category': 'Sax & DJ / Live Musician & DJ',
    'slug': 'sax-dj-live-musician-dj',
    'total_listings': 557,
    'low_price_zar': 499,
    'avg_price_zar': 11572,
    'high_price_zar': 98071,
}])
df_summary = pd.concat([df_summary, sax_dj_row], ignore_index=True)

# Remove duplicates (keep first)
df_summary = df_summary.drop_duplicates(subset='category', keep='first')

# Load individual listings
df_listings1 = pd.read_csv('/home/ubuntu/gigheaven_listings.csv')
df_listings2 = pd.read_csv('/home/ubuntu/gigheaven_listings2.csv')
df_listings = pd.concat([df_listings1, df_listings2], ignore_index=True)

print(f"Total summary categories: {len(df_summary)}")
print(f"Total individual listings: {len(df_listings)}")

# ============================================================
# 2. CATEGORIZE INTO MAIN GROUPS
# ============================================================

band_categories = [
    'Wedding Bands', 'Party Bands', 'Cover Bands', 'Jazz Bands', 'Soul Bands',
    'Pop Bands', 'Funk Bands', 'Rock Bands', 'Reggae / Ska Bands', 'Motown Bands',
    'Disco Bands', 'Swing Bands', 'Big Bands', 'Blues Bands', 'Acoustic Bands',
    'Tribute Bands'
]

dj_categories = [
    'Wedding DJs', 'Mobile DJs', 'Event DJs', 'Club DJs',
    'Sax & DJ / Live Musician & DJ'
]

solo_categories = [
    'Saxophone Players', 'Guitarists', 'Pianists', 'Singing Guitarists',
    'Violinists / Fiddlers', 'Harpists', 'Cellists', 'Classical Guitarists',
    'Classical Pianists', 'Singing Pianists', 'One Man Bands',
    'Singers With Backing Tracks'
]

ensemble_categories = [
    'String Quartets', 'Acoustic Duos', 'Classical Ensembles',
    'A Cappella Groups', 'Choirs', 'Gospel Groups'
]

wedding_specific = [
    'Wedding Singers', 'Wedding Musicians', 'Wedding Ceremony Musicians',
    'African Entertainment'
]

def assign_group(cat):
    if cat in band_categories:
        return 'Bands'
    elif cat in dj_categories:
        return 'DJs'
    elif cat in solo_categories:
        return 'Solo Performers'
    elif cat in ensemble_categories:
        return 'Ensembles & Groups'
    elif cat in wedding_specific:
        return 'Wedding-Specific'
    else:
        return 'Other'

df_summary['group'] = df_summary['category'].apply(assign_group)

# ============================================================
# 3. GENERATE VISUALIZATIONS
# ============================================================

# --- Chart 1: Average Price by Category (Top 30) ---
fig, ax = plt.subplots(figsize=(14, 10))
df_sorted = df_summary.sort_values('avg_price_zar', ascending=True)
colors_map = {
    'Bands': '#2196F3', 'DJs': '#FF9800', 'Solo Performers': '#4CAF50',
    'Ensembles & Groups': '#9C27B0', 'Wedding-Specific': '#E91E63', 'Other': '#607D8B'
}
bar_colors = [colors_map.get(g, '#607D8B') for g in df_sorted['group']]
bars = ax.barh(df_sorted['category'], df_sorted['avg_price_zar'], color=bar_colors, edgecolor='white', linewidth=0.5)
for bar, val in zip(bars, df_sorted['avg_price_zar']):
    if pd.notna(val):
        ax.text(val + 300, bar.get_y() + bar.get_height()/2, f'R{val:,.0f}', va='center', fontsize=7)
ax.set_xlabel('Average Price (ZAR)', fontsize=12)
ax.set_title('Average Booking Price by Category\nGigHeaven South Africa', fontsize=14, fontweight='bold')
# Legend
from matplotlib.patches import Patch
legend_elements = [Patch(facecolor=c, label=l) for l, c in colors_map.items()]
ax.legend(handles=legend_elements, loc='lower right', fontsize=9)
plt.tight_layout()
plt.savefig(f'{output_dir}/chart1_avg_price_by_category.png')
plt.close()
print("Chart 1 saved")

# --- Chart 2: Price Range (Low-Avg-High) for Key Categories ---
key_cats = ['Wedding Bands', 'Party Bands', 'Cover Bands', 'Jazz Bands',
            'Wedding DJs', 'Mobile DJs', 'Event DJs',
            'Sax & DJ / Live Musician & DJ',
            'Acoustic Bands', 'Acoustic Duos', 'String Quartets',
            'Saxophone Players', 'Guitarists', 'Pianists',
            'Wedding Singers', 'Wedding Musicians',
            'One Man Bands', 'Harpists', 'Violinists / Fiddlers',
            'Soul Bands', 'Funk Bands', 'Rock Bands',
            'Big Bands', 'Motown Bands', 'Disco Bands',
            'Swing Bands', 'Blues Bands', 'Tribute Bands',
            'Gospel Groups', 'African Entertainment']

df_key = df_summary[df_summary['category'].isin(key_cats)].copy()
df_key = df_key.sort_values('avg_price_zar', ascending=True)

fig, ax = plt.subplots(figsize=(14, 12))
y_pos = range(len(df_key))
for i, (_, row) in enumerate(df_key.iterrows()):
    low = row['low_price_zar'] if pd.notna(row['low_price_zar']) else 0
    avg = row['avg_price_zar'] if pd.notna(row['avg_price_zar']) else 0
    high = row['high_price_zar'] if pd.notna(row['high_price_zar']) else 0
    color = colors_map.get(row['group'], '#607D8B')
    ax.plot([low, high], [i, i], color=color, linewidth=2, alpha=0.5)
    ax.scatter([low], [i], color=color, s=30, zorder=5, marker='|')
    ax.scatter([high], [i], color=color, s=30, zorder=5, marker='|')
    ax.scatter([avg], [i], color=color, s=80, zorder=6, edgecolors='black', linewidth=0.5)

ax.set_yticks(range(len(df_key)))
ax.set_yticklabels(df_key['category'], fontsize=8)
ax.set_xlabel('Price (ZAR)', fontsize=12)
ax.set_title('Price Range (Low / Average / High) by Category\nGigHeaven South Africa', fontsize=14, fontweight='bold')
ax.set_xscale('log')
ax.legend(handles=legend_elements, loc='lower right', fontsize=9)
plt.tight_layout()
plt.savefig(f'{output_dir}/chart2_price_ranges.png')
plt.close()
print("Chart 2 saved")

# --- Chart 3: Group Comparison (Bands vs DJs vs Solo vs Ensembles) ---
group_stats = df_summary.groupby('group').agg({
    'low_price_zar': 'mean',
    'avg_price_zar': 'mean',
    'high_price_zar': 'mean',
    'total_listings': 'sum',
    'category': 'count'
}).rename(columns={'category': 'num_categories'})

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Average prices by group
groups = group_stats.index.tolist()
x = range(len(groups))
width = 0.25
axes[0].bar([i - width for i in x], group_stats['low_price_zar'], width, label='Low', color='#81C784', edgecolor='white')
axes[0].bar(x, group_stats['avg_price_zar'], width, label='Average', color='#42A5F5', edgecolor='white')
axes[0].bar([i + width for i in x], group_stats['high_price_zar'], width, label='High', color='#EF5350', edgecolor='white')
axes[0].set_xticks(x)
axes[0].set_xticklabels(groups, rotation=30, ha='right', fontsize=9)
axes[0].set_ylabel('Price (ZAR)')
axes[0].set_title('Average Price Ranges by Group', fontweight='bold')
axes[0].legend()

# Pie chart of categories
group_colors = [colors_map.get(g, '#607D8B') for g in group_stats.index]
axes[1].pie(group_stats['num_categories'], labels=group_stats.index, autopct='%1.0f%%',
            colors=group_colors, startangle=90)
axes[1].set_title('Distribution of Categories by Group', fontweight='bold')

plt.tight_layout()
plt.savefig(f'{output_dir}/chart3_group_comparison.png')
plt.close()
print("Chart 3 saved")

# --- Chart 4: DJ-specific comparison ---
df_djs = df_summary[df_summary['group'] == 'DJs'].copy()
df_djs = df_djs.sort_values('avg_price_zar')

fig, ax = plt.subplots(figsize=(10, 5))
x = range(len(df_djs))
width = 0.25
ax.bar([i - width for i in x], df_djs['low_price_zar'], width, label='Low', color='#FFB74D')
ax.bar(x, df_djs['avg_price_zar'], width, label='Average', color='#FF9800')
ax.bar([i + width for i in x], df_djs['high_price_zar'], width, label='High', color='#E65100')
ax.set_xticks(x)
ax.set_xticklabels(df_djs['category'], rotation=20, ha='right', fontsize=9)
ax.set_ylabel('Price (ZAR)')
ax.set_title('DJ Category Pricing Comparison\nGigHeaven South Africa', fontsize=13, fontweight='bold')
ax.legend()
for i, (_, row) in enumerate(df_djs.iterrows()):
    ax.text(i, row['avg_price_zar'] + 1000, f"R{row['avg_price_zar']:,.0f}", ha='center', fontsize=8, fontweight='bold')
plt.tight_layout()
plt.savefig(f'{output_dir}/chart4_dj_comparison.png')
plt.close()
print("Chart 4 saved")

# --- Chart 5: Band-specific comparison ---
df_bands = df_summary[df_summary['group'] == 'Bands'].copy()
df_bands = df_bands.sort_values('avg_price_zar')

fig, ax = plt.subplots(figsize=(14, 7))
x = range(len(df_bands))
width = 0.25
ax.bar([i - width for i in x], df_bands['low_price_zar'], width, label='Low', color='#90CAF9')
ax.bar(x, df_bands['avg_price_zar'], width, label='Average', color='#2196F3')
ax.bar([i + width for i in x], df_bands['high_price_zar'], width, label='High', color='#0D47A1')
ax.set_xticks(x)
ax.set_xticklabels(df_bands['category'], rotation=35, ha='right', fontsize=8)
ax.set_ylabel('Price (ZAR)')
ax.set_title('Band Category Pricing Comparison\nGigHeaven South Africa', fontsize=13, fontweight='bold')
ax.legend()
for i, (_, row) in enumerate(df_bands.iterrows()):
    ax.text(i, row['avg_price_zar'] + 2000, f"R{row['avg_price_zar']:,.0f}", ha='center', fontsize=7, fontweight='bold')
plt.tight_layout()
plt.savefig(f'{output_dir}/chart5_band_comparison.png')
plt.close()
print("Chart 5 saved")

# --- Chart 6: Individual listing price distribution ---
df_priced = df_listings[df_listings['price_zar'].notna() & (df_listings['price_zar'] > 0)].copy()

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Histogram
axes[0].hist(df_priced['price_zar'], bins=50, color='#42A5F5', edgecolor='white', alpha=0.8)
axes[0].set_xlabel('Price (ZAR)')
axes[0].set_ylabel('Number of Listings')
axes[0].set_title('Distribution of Individual Listing Prices', fontweight='bold')
axes[0].axvline(df_priced['price_zar'].median(), color='red', linestyle='--', label=f"Median: R{df_priced['price_zar'].median():,.0f}")
axes[0].axvline(df_priced['price_zar'].mean(), color='orange', linestyle='--', label=f"Mean: R{df_priced['price_zar'].mean():,.0f}")
axes[0].legend()

# Box plot by main categories
main_cats = ['Wedding Bands', 'Party Bands', 'Jazz Bands', 'Wedding DJs', 'Mobile DJs',
             'Saxophone Players', 'Guitarists', 'Pianists', 'Acoustic Bands']
df_box = df_priced[df_priced['category'].isin(main_cats)]
if len(df_box) > 0:
    box_data = [df_box[df_box['category'] == cat]['price_zar'].values for cat in main_cats if len(df_box[df_box['category'] == cat]) > 0]
    box_labels = [cat for cat in main_cats if len(df_box[df_box['category'] == cat]) > 0]
    bp = axes[1].boxplot(box_data, vert=True, patch_artist=True, labels=box_labels)
    colors = plt.cm.Set3(np.linspace(0, 1, len(box_data)))
    for patch, color in zip(bp['boxes'], colors):
        patch.set_facecolor(color)
    axes[1].set_xticklabels(box_labels, rotation=45, ha='right', fontsize=7)
    axes[1].set_ylabel('Price (ZAR)')
    axes[1].set_title('Price Distribution by Category\n(Individual Listings)', fontweight='bold')

plt.tight_layout()
plt.savefig(f'{output_dir}/chart6_price_distribution.png')
plt.close()
print("Chart 6 saved")

# --- Chart 7: Solo Performers Comparison ---
df_solo = df_summary[df_summary['group'] == 'Solo Performers'].copy()
df_solo = df_solo.sort_values('avg_price_zar')

fig, ax = plt.subplots(figsize=(12, 6))
x = range(len(df_solo))
width = 0.25
ax.bar([i - width for i in x], df_solo['low_price_zar'], width, label='Low', color='#A5D6A7')
ax.bar(x, df_solo['avg_price_zar'], width, label='Average', color='#4CAF50')
ax.bar([i + width for i in x], df_solo['high_price_zar'], width, label='High', color='#1B5E20')
ax.set_xticks(x)
ax.set_xticklabels(df_solo['category'], rotation=35, ha='right', fontsize=8)
ax.set_ylabel('Price (ZAR)')
ax.set_title('Solo Performer Pricing Comparison\nGigHeaven South Africa', fontsize=13, fontweight='bold')
ax.legend()
for i, (_, row) in enumerate(df_solo.iterrows()):
    ax.text(i, row['avg_price_zar'] + 500, f"R{row['avg_price_zar']:,.0f}", ha='center', fontsize=7, fontweight='bold')
plt.tight_layout()
plt.savefig(f'{output_dir}/chart7_solo_comparison.png')
plt.close()
print("Chart 7 saved")

# ============================================================
# 4. SAVE COMPREHENSIVE DATA TO EXCEL
# ============================================================

with pd.ExcelWriter(f'{output_dir}/south_africa_music_pricing_data.xlsx', engine='openpyxl') as writer:
    # Sheet 1: Summary by category
    df_summary_export = df_summary[['category', 'group', 'total_listings', 'low_price_zar', 'avg_price_zar', 'high_price_zar']].copy()
    df_summary_export.columns = ['Category', 'Group', 'Total Listings', 'Low Price (ZAR)', 'Average Price (ZAR)', 'High Price (ZAR)']
    df_summary_export = df_summary_export.sort_values('Average Price (ZAR)', ascending=False)
    df_summary_export.to_excel(writer, sheet_name='Category Summary', index=False)
    
    # Sheet 2: Individual listings
    df_listings_export = df_listings.copy()
    df_listings_export.columns = ['Category', 'Price (ZAR)', 'Price (USD)', 'Price (Other)', 'Currency', 'Location', 'Reviews', 'Is POA']
    df_listings_export.to_excel(writer, sheet_name='Individual Listings', index=False)
    
    # Sheet 3: Group summary
    group_summary = df_summary.groupby('group').agg({
        'low_price_zar': ['min', 'mean'],
        'avg_price_zar': ['min', 'mean', 'max'],
        'high_price_zar': ['max', 'mean'],
        'category': 'count'
    }).round(0)
    group_summary.columns = ['Min Low Price', 'Avg Low Price', 'Min Avg Price', 'Mean Avg Price', 'Max Avg Price', 'Max High Price', 'Avg High Price', 'Num Categories']
    group_summary.to_excel(writer, sheet_name='Group Summary')
    
    # Sheet 4: Cross-source comparison
    cross_source = pd.DataFrame([
        {'Source': 'GigHeaven', 'Category': 'Wedding Bands', 'Low (ZAR)': 931, 'Average (ZAR)': 25768, 'High (ZAR)': 406429, 'Notes': '1641 listings'},
        {'Source': 'GigHeaven', 'Category': 'Party Bands', 'Low (ZAR)': 976, 'Average (ZAR)': 29605, 'High (ZAR)': 406429, 'Notes': '1071 listings'},
        {'Source': 'GigHeaven', 'Category': 'Wedding DJs', 'Low (ZAR)': 499, 'Average (ZAR)': 12169, 'High (ZAR)': 249733, 'Notes': 'Includes equipment'},
        {'Source': 'GigHeaven', 'Category': 'Mobile DJs', 'Low (ZAR)': 499, 'Average (ZAR)': 10852, 'High (ZAR)': 98122, 'Notes': ''},
        {'Source': 'GigHeaven', 'Category': 'Event DJs', 'Low (ZAR)': 499, 'Average (ZAR)': 11783, 'High (ZAR)': 249733, 'Notes': ''},
        {'Source': 'GigHeaven', 'Category': 'Sax & DJ', 'Low (ZAR)': 499, 'Average (ZAR)': 11572, 'High (ZAR)': 98071, 'Notes': '557 listings'},
        {'Source': 'GigHeaven', 'Category': 'Jazz Bands', 'Low (ZAR)': 931, 'Average (ZAR)': 19025, 'High (ZAR)': 196268, 'Notes': '823 listings'},
        {'Source': 'GigHeaven', 'Category': 'Acoustic Bands', 'Low (ZAR)': 386, 'Average (ZAR)': 14984, 'High (ZAR)': 157014, 'Notes': ''},
        {'Source': 'GigHeaven', 'Category': 'String Quartets', 'Low (ZAR)': 1498, 'Average (ZAR)': 12146, 'High (ZAR)': 53965, 'Notes': ''},
        {'Source': 'GigHeaven', 'Category': 'Saxophone Players', 'Low (ZAR)': 590, 'Average (ZAR)': 11533, 'High (ZAR)': 98122, 'Notes': '552 listings'},
        {'Source': 'Gigster.co.za', 'Category': 'Celebrity/Headliner Bands', 'Low (ZAR)': 50000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': '1x 60-90 min set, upwards'},
        {'Source': 'Gigster.co.za', 'Category': 'Corporate/Show Bands', 'Low (ZAR)': 20000, 'Average (ZAR)': 40000, 'High (ZAR)': 60000, 'Notes': '2-3 x 45 min sets'},
        {'Source': 'Gigster.co.za', 'Category': 'Private Function Bands', 'Low (ZAR)': 8000, 'Average (ZAR)': 19000, 'High (ZAR)': 30000, 'Notes': '3-4 x 45 min sets'},
        {'Source': 'Gigster.co.za', 'Category': 'Small/Medium African Bands', 'Low (ZAR)': 6000, 'Average (ZAR)': 9000, 'High (ZAR)': 12000, 'Notes': '2-3 hours'},
        {'Source': 'Gigster.co.za', 'Category': 'Larger African Bands', 'Low (ZAR)': 25000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Upwards, 2-3 x 45 min sets'},
        {'Source': 'Gigster.co.za', 'Category': 'Solo Instrumentalists', 'Low (ZAR)': 3000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Upwards'},
        {'Source': 'Gigster.co.za', 'Category': 'Vocalist (backing tracks)', 'Low (ZAR)': 8000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Upwards'},
        {'Source': 'Gigster.co.za', 'Category': 'One-man Band', 'Low (ZAR)': 6000, 'Average (ZAR)': 10500, 'High (ZAR)': 15000, 'Notes': ''},
        {'Source': 'Gigster.co.za', 'Category': 'Classical Duo', 'Low (ZAR)': 5000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Upwards'},
        {'Source': 'Gigster.co.za', 'Category': 'Classical Trio', 'Low (ZAR)': 7000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Upwards'},
        {'Source': 'Gigster.co.za', 'Category': 'Classical Quartet', 'Low (ZAR)': 9000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Upwards'},
        {'Source': 'Gigster.co.za', 'Category': 'African Choir', 'Low (ZAR)': 8000, 'Average (ZAR)': 11500, 'High (ZAR)': 15000, 'Notes': ''},
        {'Source': 'Gigster.co.za', 'Category': 'Function DJs', 'Low (ZAR)': 7000, 'Average (ZAR)': 11000, 'High (ZAR)': 15000, 'Notes': ''},
        {'Source': 'DJ Wico (Cape Town)', 'Category': 'Classic DJ Package', 'Low (ZAR)': 17000, 'Average (ZAR)': 17000, 'High (ZAR)': 17000, 'Notes': '±8hrs, up to 80 guests, ceremony+reception'},
        {'Source': 'DJ Wico (Cape Town)', 'Category': 'VIP DJ Package', 'Low (ZAR)': 20000, 'Average (ZAR)': 20000, 'High (ZAR)': 20000, 'Notes': '±8hrs, most popular'},
        {'Source': 'DJ Wico (Cape Town)', 'Category': 'DJ + Live Musician Package', 'Low (ZAR)': 30500, 'Average (ZAR)': 30500, 'High (ZAR)': 30500, 'Notes': '±8hrs, includes live band 2x45min'},
        {'Source': 'DJ Wico (Cape Town)', 'Category': 'DJ + Saxophone Package', 'Low (ZAR)': 30000, 'Average (ZAR)': 30000, 'High (ZAR)': 30000, 'Notes': '±8hrs, includes sax 2x45min'},
        {'Source': 'DJ Wico (Cape Town)', 'Category': 'DJ + Violin Package', 'Low (ZAR)': 31000, 'Average (ZAR)': 31000, 'High (ZAR)': 31000, 'Notes': '±8hrs, includes violin 2x45min'},
        {'Source': 'DJ Wico (Cape Town)', 'Category': 'Dual DJ Package', 'Low (ZAR)': 38000, 'Average (ZAR)': 38000, 'High (ZAR)': 38000, 'Notes': '±8hrs, 2 DJs'},
        {'Source': 'The DJ Company (Cape Town)', 'Category': 'Vibe Package (Events)', 'Low (ZAR)': 9799, 'Average (ZAR)': 14000, 'High (ZAR)': 14000, 'Notes': 'Up to 40 guests, 30% off promo'},
        {'Source': 'The DJ Company (Cape Town)', 'Category': 'Celebration Package', 'Low (ZAR)': 12599, 'Average (ZAR)': 18000, 'High (ZAR)': 18000, 'Notes': 'Up to 80 guests, 30% off promo'},
        {'Source': 'The DJ Company (Cape Town)', 'Category': 'Showstopper Package', 'Low (ZAR)': 17499, 'Average (ZAR)': 25000, 'High (ZAR)': 25000, 'Notes': 'Up to 150 guests, 30% off promo'},
        {'Source': 'Cream Cheese DJs (JHB)', 'Category': 'Professional DJ (hourly)', 'Low (ZAR)': 1200, 'Average (ZAR)': 1350, 'High (ZAR)': 1500, 'Notes': 'Per hour, 2024 rates'},
        {'Source': 'Cream Cheese DJs (JHB)', 'Category': 'Wedding DJ (min budget)', 'Low (ZAR)': 8500, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Minimum recommended for 2024'},
        {'Source': 'CueUp', 'Category': 'DJ Johannesburg (hourly)', 'Low (ZAR)': 900, 'Average (ZAR)': 2000, 'High (ZAR)': 5400, 'Notes': '$50-$300/hr, avg $110/hr'},
        {'Source': 'CueUp', 'Category': 'DJ Cape Town (hourly)', 'Low (ZAR)': 1044, 'Average (ZAR)': 2160, 'High (ZAR)': 6300, 'Notes': '$58-$350/hr, avg $120/hr'},
        {'Source': 'Bridebook', 'Category': 'Wedding Music (overall)', 'Low (ZAR)': 6000, 'Average (ZAR)': 15500, 'High (ZAR)': 25000, 'Notes': 'DJ, solo, or full band'},
        {'Source': 'Bridebook', 'Category': 'Solo Musician', 'Low (ZAR)': 3000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Starting from'},
        {'Source': 'Bridebook', 'Category': 'Duo', 'Low (ZAR)': 5000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Starting from'},
        {'Source': 'Bridebook', 'Category': 'Live Band (evening)', 'Low (ZAR)': 15000, 'Average (ZAR)': 20000, 'High (ZAR)': 25000, 'Notes': 'Or more'},
        {'Source': 'Bridebook', 'Category': 'String Quartet', 'Low (ZAR)': 6000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Starting from'},
        {'Source': 'Bridebook', 'Category': 'Wedding DJ', 'Low (ZAR)': 4000, 'Average (ZAR)': 7000, 'High (ZAR)': 10000, 'Notes': 'Depends on equipment & time'},
        {'Source': 'Bridebook', 'Category': 'Ceremony Musician', 'Low (ZAR)': 2000, 'Average (ZAR)': 4000, 'High (ZAR)': 6000, 'Notes': 'Ceremony only'},
        {'Source': 'Pink Book', 'Category': 'Wedding DJ', 'Low (ZAR)': 8500, 'Average (ZAR)': 8500, 'High (ZAR)': None, 'Notes': '3.5% of R250k budget, ceremony to midnight'},
        {'Source': 'Entertainers Worldwide', 'Category': 'MR Pentatonic (Cover)', 'Low (ZAR)': 3000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'KwaZulu-Natal'},
        {'Source': 'Entertainers Worldwide', 'Category': 'Courus (Duo)', 'Low (ZAR)': 20000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Johannesburg, 5-piece options'},
        {'Source': 'Entertainers Worldwide', 'Category': 'ONE ACCORD (Cover Band)', 'Low (ZAR)': 30000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Johannesburg'},
        {'Source': 'Entertainers Worldwide', 'Category': 'Trio 3 (Party Band)', 'Low (ZAR)': 15000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Johannesburg'},
        {'Source': 'Entertainers Worldwide', 'Category': 'CLEMOUR (Party Band)', 'Low (ZAR)': 12000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Johannesburg'},
        {'Source': 'Entertainers Worldwide', 'Category': 'Downtown Gypsies (Duo)', 'Low (ZAR)': 9000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Cape Town'},
        {'Source': 'Entertainers Worldwide', 'Category': 'Milkyway Galaxy (Afro Jazz)', 'Low (ZAR)': 20000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Durban'},
        {'Source': 'Facebook Community', 'Category': 'DJ (basic)', 'Low (ZAR)': 4999, 'Average (ZAR)': 7000, 'High (ZAR)': None, 'Notes': 'Community discussion'},
        {'Source': 'Reddit (2022)', 'Category': 'Acoustic Gig (per hour)', 'Low (ZAR)': 5000, 'Average (ZAR)': None, 'High (ZAR)': None, 'Notes': 'Per hour for 12-piece band'},
    ])
    cross_source.to_excel(writer, sheet_name='Cross-Source Comparison', index=False)

    # Sheet 5: Bridebook entertainment costs
    entertainment = pd.DataFrame([
        {'Type': 'Fireworks', 'Starting From (ZAR)': 12000, 'Typical Range': 'R12,000+', 'Notes': 'Depends on duration & customisation'},
        {'Type': 'Photo Booth (2hr)', 'Starting From (ZAR)': 2300, 'Typical Range': 'R2,300 - R5,000+', 'Notes': 'Standard to premium/360'},
        {'Type': "Children's Entertainment", 'Starting From (ZAR)': 3000, 'Typical Range': 'R3,000+', 'Notes': 'Play corners, activity packs'},
        {'Type': 'Magician', 'Starting From (ZAR)': 5000, 'Typical Range': 'R5,000+', 'Notes': 'Roaming/close-up'},
        {'Type': 'Mind Reader', 'Starting From (ZAR)': 5000, 'Typical Range': 'R5,000 - R20,000+', 'Notes': 'Up to international performers'},
        {'Type': 'Face/Glitter Artists', 'Starting From (ZAR)': 3000, 'Typical Range': 'R3,000+', 'Notes': ''},
        {'Type': 'Casino Entertainment', 'Starting From (ZAR)': 10000, 'Typical Range': 'R10,000+', 'Notes': 'Blackjack, roulette, poker tables'},
        {'Type': 'Circus Performers', 'Starting From (ZAR)': 8000, 'Typical Range': 'R8,000+', 'Notes': 'Fire jugglers, stilt walkers, aerial'},
        {'Type': 'Dancers', 'Starting From (ZAR)': 8000, 'Typical Range': 'R8,000+', 'Notes': 'Traditional African to modern'},
        {'Type': 'Bouncy Castle', 'Starting From (ZAR)': 2000, 'Typical Range': 'R2,000+', 'Notes': 'Outdoor weddings'},
    ])
    entertainment.to_excel(writer, sheet_name='Other Entertainment', index=False)

print(f"\nExcel file saved to {output_dir}/south_africa_music_pricing_data.xlsx")

# ============================================================
# 5. PRINT SUMMARY STATISTICS
# ============================================================

print("\n" + "="*60)
print("SUMMARY STATISTICS")
print("="*60)

print(f"\nTotal categories analyzed: {len(df_summary)}")
print(f"Total individual listings scraped: {len(df_listings)}")
print(f"Listings with ZAR prices: {len(df_listings[df_listings['price_zar'].notna()])}")
print(f"Listings with POA (Price on Application): {len(df_listings[df_listings['is_poa'] == True])}")

print("\n--- Price Statistics (ZAR) across all categories ---")
print(f"Lowest starting price: R{df_summary['low_price_zar'].min():,.0f}")
print(f"Highest starting price: R{df_summary['high_price_zar'].max():,.0f}")
print(f"Overall average: R{df_summary['avg_price_zar'].mean():,.0f}")

print("\n--- By Group ---")
for group in df_summary['group'].unique():
    grp = df_summary[df_summary['group'] == group]
    print(f"\n{group}:")
    print(f"  Categories: {len(grp)}")
    print(f"  Avg price range: R{grp['low_price_zar'].mean():,.0f} - R{grp['avg_price_zar'].mean():,.0f} - R{grp['high_price_zar'].mean():,.0f}")

print("\nDone!")
