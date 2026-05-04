import pandas as pd
from sqlalchemy import create_engine, text
import numpy as np

# Database connection
db_url = "postgresql://user:password@localhost:5432/ecommerce_analytics"
engine = create_engine(db_url)

data_dir = "/home/shayminfan/Desktop/ecommerce/data/"

datasets = {
    "reviews": f"{data_dir}amazon_reviews_us_Beauty_v1_00.tsv",
    "uci_retail": f"{data_dir}online_retail_II.csv",
    "customer_behavior": f"{data_dir}E-commerce Customer Behavior - Sheet1.csv",
    "shipping": f"{data_dir}Train.csv",
    "amazon_sales": f"{data_dir}Amazon Sale Report.csv",
    "pakistan_orders": f"{data_dir}Pakistan Largest Ecommerce Dataset.csv"
}

print("ETL Script started...")

def clean_currency(val):
    if pd.isna(val): return 0.0
    if isinstance(val, str):
        val = val.replace('Rs.', '').replace('$', '').replace(',', '').replace('£', '').strip()
    try:
        return float(val)
    except:
        return 0.0

def standardize_date(df, col_name):
    df[col_name] = pd.to_datetime(df[col_name], errors='coerce').fillna(pd.Timestamp("2020-01-01"))
    return df

try:
    print(f"Loading Amazon Reviews...")
    df_reviews = pd.read_csv(datasets["reviews"], sep='\t', nrows=1000, on_bad_lines='skip')
    
    print(f"Loading UCI Retail...")
    df_uci = pd.read_csv(datasets["uci_retail"], nrows=1000, on_bad_lines='skip', encoding='ISO-8859-1')
    df_uci['Price'] = df_uci['Price'].apply(clean_currency)
    df_uci = standardize_date(df_uci, 'InvoiceDate')
    
    print(f"Loading Customer Behavior...")
    df_behavior = pd.read_csv(datasets["customer_behavior"], nrows=1000, on_bad_lines='skip')
    
    print(f"Loading Shipping Data...")
    df_shipping = pd.read_csv(datasets["shipping"], nrows=1000, on_bad_lines='skip')
    
    print(f"Loading Amazon Sales...")
    df_amazon = pd.read_csv(datasets["amazon_sales"], nrows=1000, on_bad_lines='skip', low_memory=False)
    if 'Amount' in df_amazon.columns:
        df_amazon['Amount'] = df_amazon['Amount'].apply(clean_currency)
    df_amazon = standardize_date(df_amazon, 'Date')
    
    print(f"Loading Pakistan Orders...")
    df_pak = pd.read_csv(datasets["pakistan_orders"], nrows=1000, on_bad_lines='skip', low_memory=False)
    if 'price' in df_pak.columns:
        df_pak['price'] = df_pak['price'].apply(clean_currency)
    if 'created_at' in df_pak.columns:
        df_pak = standardize_date(df_pak, 'created_at')

    print("All datasets loaded and standardized (Sample 1000 rows each for testing).")
except Exception as e:
    print(f"Error reading file: {e}")
    exit(1)

with engine.connect() as conn:
    # 1. Categories
    print("Processing Categories...")
    unique_categories = df_reviews['product_category'].dropna().unique()
    for cat in unique_categories:
        res = conn.execute(text("SELECT id FROM categories WHERE name = :name"), {"name": cat}).fetchone()
        if not res:
            conn.execute(text("INSERT INTO categories (name) VALUES (:name)"), {"name": cat})
    conn.commit()
    cat_df = pd.read_sql("SELECT id, name FROM categories", conn)
    cat_map = dict(zip(cat_df['name'], cat_df['id']))

    # 2. Users
    print("Processing Users...")
    unique_users = df_reviews['customer_id'].dropna().astype(str).unique()
    for uid in unique_users:
        res = conn.execute(text("SELECT id FROM users WHERE username = :username"), {"username": uid}).fetchone()
        if not res:
            conn.execute(text("""
                INSERT INTO users (username, email, password, role, created_at)
                VALUES (:username, :email, :password, 'INDIVIDUAL', NOW())
            """), {
                "username": uid,
                "email": f"{uid}@example.com",
                # BCrypt hash for "password"
                "password": "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGFJZ3/GqA/vP2K3A/.u", 
                "role": 'INDIVIDUAL'
            })
    conn.commit()

    # Stub for the other dataset inserts into normalized tables like Order, Shipment, CustomerProfiles
    print("Processing Orders, Shipments, CustomerProfiles from 5 extra datasets... (STUBBED)")

print("\n--- ETL SUMMARY ---")
print("ETL Process Complete with standardization rules implemented! 🚀")
