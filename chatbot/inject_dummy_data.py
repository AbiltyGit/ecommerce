import sqlalchemy
from sqlalchemy import text
import random

engine = sqlalchemy.create_engine('postgresql://user:password@localhost:5432/ecommerce_analytics')

def run():
    with engine.connect() as conn:
        # 1. Get existing categories
        cat_rows = conn.execute(text("SELECT id, name FROM categories")).fetchall()
        if not cat_rows:
            # Fallback if categories are empty
            categories = ['Electronics', 'Fashion', 'Home Decor', 'Sports', 'Books']
            for cat in categories:
                conn.execute(text("INSERT INTO categories (name) VALUES (:name) ON CONFLICT DO NOTHING"), {"name": cat})
            conn.commit()
            cat_rows = conn.execute(text("SELECT id, name FROM categories")).fetchall()
            
        cat_map = {name: id for id, name in cat_rows}
        cat_ids = [id for id, name in cat_rows]
        
        # 2. Create more Corporate Users & Stores
        corporates = [
            ('tech_admin', 'tech@example.com', 'Tech Store'),
            ('fashion_admin', 'fashion@example.com', 'Fashion Boutique'),
            ('home_admin', 'home@example.com', 'Home Style')
        ]
        
        for username, email, store_name in corporates:
            # Check if user exists
            user_exists = conn.execute(text("SELECT id FROM users WHERE username = :u"), {"u": username}).fetchone()
            if not user_exists:
                res = conn.execute(text("INSERT INTO users (username, email, password, role, created_at) VALUES (:u, :e, 'password', 'CORPORATE', NOW()) RETURNING id"), 
                             {"u": username, "e": email})
                user_id = res.fetchone()[0]
                
                # Create Store
                conn.execute(text("INSERT INTO stores (name, description, is_open, corporate_user_id) VALUES (:n, :d, true, :uid)"),
                             {"n": store_name, "d": f"Official {store_name}", "uid": user_id})
        
        # 3. Add products to these stores
        store_rows = conn.execute(text("SELECT id, name FROM stores WHERE name IN ('Tech Store', 'Fashion Boutique', 'Home Style')")).fetchall()
        
        for store_id, store_name in store_rows:
            # Add 20 products per store
            for i in range(20):
                target_cat = random.choice(cat_ids)
                prod_name = f"{store_name} Item {i+1}"
                price = round(random.uniform(10, 500), 2)
                stock = random.randint(5, 100)
                
                conn.execute(text("""
                    INSERT INTO products (name, description, price, stock_quantity, category_id, store_id) 
                    VALUES (:n, :d, :p, :s, :cid, :sid)
                """), {"n": prod_name, "d": f"Premium quality product from {store_name}", "p": price, "s": stock, "cid": target_cat, "sid": store_id})
        
        # 4. Generate some random reviews so store comparison has ratings
        prod_rows = conn.execute(text("SELECT id FROM products WHERE store_id IN (SELECT id FROM stores WHERE name != 'Official Store')")).fetchall()
        for prod_id_row in prod_rows:
            prod_id = prod_id_row[0]
            # Add 2-5 reviews per new product
            for _ in range(random.randint(2, 5)):
                rating = random.randint(3, 5)
                # Use admin user (ID 1) or any existing user as reviewer
                conn.execute(text("""
                    INSERT INTO reviews (product_id, user_id, rating, comment, status, created_at)
                    VALUES (:pid, 1, :r, 'Great product!', 'APPROVED', NOW())
                """), {"pid": prod_id, "r": rating})
        
        conn.commit()
        print("Successfully injected dummy data for multi-store comparison!")

if __name__ == "__main__":
    run()
