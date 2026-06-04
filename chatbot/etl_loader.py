import pandas as pd
from sqlalchemy import create_engine, text
import numpy as np
import warnings

warnings.filterwarnings('ignore')

# Database connection
db_url = "postgresql://user:password@localhost:5432/ecommerce_analytics"
engine = create_engine(db_url)

data_dir = "/home/shayminfan/Desktop/ecommerce/chatbot/sampled_data/"

datasets = {
    "reviews_beauty": f"{data_dir}sampled_amazon_reviews_us_Beauty_v1_00.tsv",
    "reviews_grocery": f"{data_dir}sampled_amazon_reviews_us_Grocery_v1_00.tsv",
    "reviews_electronics": f"{data_dir}sampled_amazon_reviews_us_Electronics_v1_00.tsv",
    "uci_retail": f"{data_dir}sampled_online_retail_II.csv",
    "customer_behavior": f"{data_dir}sampled_E-commerce Customer Behavior - Sheet1.csv",
    "shipping": f"{data_dir}sampled_Train.csv",
    "amazon_sales": f"{data_dir}sampled_Amazon Sale Report.csv",
    "pakistan_orders": f"{data_dir}sampled_Pakistan Largest Ecommerce Dataset.csv"
}

def clean_currency(val):
    if pd.isna(val): return 0.0
    if isinstance(val, str):
        val = val.replace('Rs.', '').replace('$', '').replace(',', '').replace('£', '').strip()
    try:
        return float(val)
    except:
        return 0.0

def clean_rating(val):
    try:
        return int(float(val))
    except:
        return None

print("ETL Script started...")

try:
    with engine.connect() as conn:
        # 0. Initial Setup: Store
        print("Ensuring default store exists...")
        store_res = conn.execute(text("SELECT id FROM stores LIMIT 1")).fetchone()
        if not store_res:
            conn.execute(text("INSERT INTO stores (name, description, is_open) VALUES ('Global Store', 'Main Store for ETL', true)"))
            conn.commit()
            store_id = conn.execute(text("SELECT id FROM stores LIMIT 1")).fetchone()[0]
        else:
            store_id = store_res[0]

        # 1. Categories
        print("Processing Categories...")
        df_beauty = pd.read_csv(datasets["reviews_beauty"], sep='\t', on_bad_lines='skip', low_memory=False)
        df_grocery = pd.read_csv(datasets["reviews_grocery"], sep='\t', on_bad_lines='skip', low_memory=False)
        df_electronics = pd.read_csv(datasets["reviews_electronics"], sep='\t', on_bad_lines='skip', low_memory=False)
        
        df_reviews = pd.concat([df_beauty, df_grocery, df_electronics], ignore_index=True)
        
        unique_categories = df_reviews['product_category'].dropna().unique()
        for cat in unique_categories:
            res = conn.execute(text("SELECT id FROM categories WHERE name = :name"), {"name": cat}).fetchone()
            if not res:
                conn.execute(text("INSERT INTO categories (name) VALUES (:name)"), {"name": cat})
        conn.commit()
        cat_df = pd.read_sql("SELECT id, name FROM categories", conn)
        cat_map = dict(zip(cat_df['name'], cat_df['id']))

        # 2. Users & Profiles
        print("Processing Users & Profiles...")
        df_behavior = pd.read_csv(datasets["customer_behavior"])
        for _, row in df_behavior.iterrows():
            uid = str(row['Customer ID'])
            res = conn.execute(text("SELECT id FROM users WHERE username = :username"), {"username": uid}).fetchone()
            if not res:
                user_id = conn.execute(text("""
                    INSERT INTO users (username, email, password, role, created_at)
                    VALUES (:username, :email, :password, 'INDIVIDUAL', NOW())
                    RETURNING id
                """), {
                    "username": uid,
                    "email": f"{uid}@example.com",
                    "password": "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGFJZ3/GqA/vP2K3A/.u",
                    "role": 'INDIVIDUAL'
                }).fetchone()[0]
                
                # Insert Profile
                conn.execute(text("""
                    INSERT INTO customer_profiles (user_id, gender, age, city, membership_type, total_spend, items_purchased, avg_rating, discount_applied, satisfaction_level)
                    VALUES (:user_id, :gender, :age, :city, :membership_type, :total_spend, :items_purchased, :avg_rating, :discount_applied, :satisfaction_level)
                """), {
                    "user_id": user_id,
                    "gender": row['Gender'],
                    "age": int(row['Age']),
                    "city": row['City'],
                    "membership_type": row['Membership Type'],
                    "total_spend": float(row['Total Spend']),
                    "items_purchased": int(row['Items Purchased']),
                    "avg_rating": float(row['Average Rating']),
                    "discount_applied": bool(row['Discount Applied']),
                    "satisfaction_level": {"Satisfied": 5, "Neutral": 3, "Unsatisfied": 1}.get(row['Satisfaction Level'], 0)
                })
        conn.commit()

        # 3. Products
        print("Processing Products...")
        unique_products = df_reviews[['product_id', 'product_title', 'product_category']].drop_duplicates()
        for _, row in unique_products.iterrows():
            res = conn.execute(text("SELECT id FROM products WHERE sku = :sku"), {"sku": row['product_id']}).fetchone()
            if not res:
                conn.execute(text("""
                    INSERT INTO products (sku, name, description, price, stock_quantity, category_id, store_id)
                    VALUES (:sku, :name, :description, :price, :stock_quantity, :category_id, :store_id)
                """), {
                    "sku": row['product_id'],
                    "name": str(row['product_title'])[:255],
                    "description": f"Imported from {row['product_category']}",
                    "price": 19.99,
                    "stock_quantity": 100,
                    "category_id": cat_map.get(row['product_category']),
                    "store_id": store_id
                })
        conn.commit()
        prod_df = pd.read_sql("SELECT id, sku FROM products", conn)
        prod_map = dict(zip(prod_df['sku'], prod_df['id']))

        # 4. Reviews
        print("Processing Reviews...")
        user_df = pd.read_sql("SELECT id, username FROM users", conn)
        user_map = dict(zip(user_df['username'], user_df['id']))
        for _, row in df_reviews.iterrows():
            cust_id = str(row['customer_id'])
            u_id = user_map.get(cust_id)
            
            if not u_id:
                # Create user for reviewer
                u_id = conn.execute(text("""
                    INSERT INTO users (username, email, password, role, created_at)
                    VALUES (:username, :email, :password, 'INDIVIDUAL', NOW())
                    RETURNING id
                """), {
                    "username": cust_id,
                    "email": f"user{cust_id}@example.com",
                    "password": "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGFJZ3/GqA/vP2K3A/.u",
                    "role": 'INDIVIDUAL'
                }).fetchone()[0]
                user_map[cust_id] = u_id

            p_id = prod_map.get(row['product_id'])
            rating = clean_rating(row['star_rating'])
            
            if u_id and p_id and rating is not None:
                conn.execute(text("""
                    INSERT INTO reviews (user_id, product_id, rating, comment, helpful_votes, total_votes, status, created_at)
                    VALUES (:user_id, :product_id, :rating, :comment, :helpful_votes, :total_votes, 'APPROVED', :created_at)
                """), {
                    "user_id": u_id,
                    "product_id": p_id,
                    "rating": rating,
                    "comment": str(row['review_body'])[:2000] if pd.notna(row['review_body']) else '',
                    "helpful_votes": int(float(row['helpful_votes'])) if pd.notna(row['helpful_votes']) else 0,
                    "total_votes": int(float(row['total_votes'])) if pd.notna(row['total_votes']) else 0,
                    "created_at": pd.to_datetime(row['review_date'])
                })
        conn.commit()

        # 5. Orders & Shipments
        print("Processing Orders & Shipments from Pakistan Dataset...")
        df_pak = pd.read_csv(datasets["pakistan_orders"], low_memory=False)
        for _, row in df_pak.iterrows():
            u_id = user_map.get(str(row['Customer ID']))
            if u_id and pd.notna(row['created_at']):
                order_id = conn.execute(text("""
                    INSERT INTO orders (user_id, order_date, status, total_amount, payment_method)
                    VALUES (:user_id, :order_date, 'DELIVERED', :total_amount, :payment_method)
                    RETURNING id
                """), {
                    "user_id": u_id,
                    "order_date": pd.to_datetime(row['created_at']),
                    "total_amount": clean_currency(row['grand_total']),
                    "payment_method": row['payment_method'] if pd.notna(row['payment_method']) else 'COD'
                }).fetchone()[0]
                
                # Insert Shipment
                conn.execute(text("""
                    INSERT INTO shipments (order_id, warehouse_block, mode_of_shipment, tracking_number, shipped_date)
                    VALUES (:order_id, 'Block A', 'Road', :tracking, :shipped_date)
                """), {
                    "order_id": order_id,
                    "tracking": f"TRK-{order_id}-{np.random.randint(1000, 9999)}",
                    "shipped_date": pd.to_datetime(row['created_at']) + pd.Timedelta(days=1)
                })
        conn.commit()

except Exception as e:
    print(f"Error in ETL: {e}")
    exit(1)

print("\n--- ETL SUMMARY ---")
print("ETL Process Complete with real data mapping! 🚀")
