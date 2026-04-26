import pandas as pd
from sqlalchemy import create_engine, text
import numpy as np

# Database connection
db_url = "postgresql://user:password@localhost:5432/ecommerce_analytics"
engine = create_engine(db_url)

file_path = "/home/shayminfan/Desktop/ecommerce/data/amazon_reviews_us_Beauty_v1_00.tsv"

print("ETL Script started...")
print(f"Loading data from: {file_path}")

try:
    # Read the first 5000 rows
    df = pd.read_csv(file_path, sep='\t', nrows=5000, on_bad_lines='skip')
    print(f"Loaded {len(df)} rows from TSV.")
except Exception as e:
    print(f"Error reading file: {e}")
    exit(1)

with engine.connect() as conn:
    # 1. Categories
    print("Processing Categories...")
    unique_categories = df['product_category'].dropna().unique()
    for cat in unique_categories:
        # Check if exists
        res = conn.execute(text("SELECT id FROM categories WHERE name = :name"), {"name": cat}).fetchone()
        if not res:
            conn.execute(text("INSERT INTO categories (name) VALUES (:name)"), {"name": cat})
    conn.commit()
    cat_df = pd.read_sql("SELECT id, name FROM categories", conn)
    cat_map = dict(zip(cat_df['name'], cat_df['id']))

    # 2. Users
    print("Processing Users...")
    unique_users = df['customer_id'].dropna().astype(str).unique()
    for uid in unique_users:
        res = conn.execute(text("SELECT id FROM users WHERE username = :username"), {"username": uid}).fetchone()
        if not res:
            conn.execute(text("""
                INSERT INTO users (username, email, password, role, created_at)
                VALUES (:username, :email, :password, 'INDIVIDUAL', NOW())
            """), {
                "username": uid,
                "email": f"{uid}@example.com",
                "password": "hashed_password_placeholder" 
            })
    conn.commit()
    user_df = pd.read_sql("SELECT id, username FROM users", conn)
    user_map = dict(zip(user_df['username'], user_df['id']))

    # 3. Products
    print("Processing Products...")
    products_df = df[['product_id', 'product_title', 'product_category']].drop_duplicates(subset=['product_id']).dropna()
    for _, row in products_df.iterrows():
        sku = str(row['product_id'])
        name = str(row['product_title'])[:250]
        cat_id = cat_map.get(row['product_category'])
        
        res = conn.execute(text("SELECT id FROM products WHERE sku = :sku"), {"sku": sku}).fetchone()
        if not res:
            conn.execute(text("""
                INSERT INTO products (sku, name, description, price, stock_quantity, category_id)
                VALUES (:sku, :name, 'Extracted from Kaggle Dataset', 19.99, 100, :category_id)
            """), {
                "sku": sku,
                "name": name,
                "category_id": cat_id
            })
    conn.commit()
    prod_df = pd.read_sql("SELECT id, sku FROM products", conn)
    prod_map = dict(zip(prod_df['sku'], prod_df['id']))

    # 4. Reviews
    print("Processing Reviews...")
    reviews_to_insert = []
    
    # Optional: Clear old reviews if we want a fresh start
    # conn.execute(text("TRUNCATE TABLE reviews CASCADE"))
    # conn.commit()
    
    for _, row in df.iterrows():
        u_id = user_map.get(str(row['customer_id']))
        p_id = prod_map.get(str(row['product_id']))
        
        if u_id and p_id:
            reviews_to_insert.append({
                "product_id": p_id,
                "user_id": u_id,
                "rating": int(row['star_rating']) if pd.notna(row['star_rating']) else 0,
                "comment": str(row['review_body'])[:1000] if pd.notna(row['review_body']) else "",
                "helpful_votes": int(row['helpful_votes']) if pd.notna(row['helpful_votes']) else 0,
                "total_votes": int(row['total_votes']) if pd.notna(row['total_votes']) else 0,
                "created_at": row['review_date'] if pd.notna(row['review_date']) else "2015-01-01"
            })

    if reviews_to_insert:
        print(f"Preparing to insert {len(reviews_to_insert)} reviews...")
        reviews_df = pd.DataFrame(reviews_to_insert)
        reviews_df['created_at'] = pd.to_datetime(reviews_df['created_at'], errors='coerce').fillna(pd.Timestamp("2015-01-01"))
        
        # In Pandas 2.0+, to_sql with SQLAlchemy works best.
        reviews_df.to_sql('reviews', engine, if_exists='append', index=False)
        print("Reviews successfully inserted!")

print("\n--- ETL SUMMARY ---")
print(f"Categories Loaded: {len(unique_categories)}")
print(f"Users Loaded: {len(unique_users)}")
print(f"Products Loaded: {len(products_df)}")
print(f"Reviews Loaded: {len(reviews_to_insert)}")
print("ETL Process Complete! 🚀")
