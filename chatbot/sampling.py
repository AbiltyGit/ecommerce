import pandas as pd
import os
import glob


def sample_large_datasets(input_dir, output_dir, sample_fraction=0.01, threshold_mb=100):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    target_files = [
        "amazon_reviews_us_Beauty_v1_00.tsv",
        "amazon_reviews_us_Grocery_v1_00.tsv",
        "amazon_reviews_us_Electronics_v1_00.tsv",
        "online_retail_II.csv",
        "E-commerce Customer Behavior - Sheet1.csv",
        "Train.csv",
        "Amazon Sale Report.csv",
        "Pakistan Largest Ecommerce Dataset.csv"
    ]
    
    all_files = [os.path.join(input_dir, f) for f in target_files if os.path.exists(os.path.join(input_dir, f))]
    threshold_bytes = threshold_mb * 1024 * 1024

    for file_path in all_files:
        file_name = os.path.basename(file_path)
        output_path = os.path.join(output_dir, f"sampled_{file_name}")
        file_size = os.path.getsize(file_path)
        
        current_fraction = 1.0 if file_size < threshold_bytes else sample_fraction
        
        print(f"Processing {file_name} (Size: {file_size/(1024*1024):.1f}MB, Fraction: {current_fraction*100}%)...")

        # Determine separator
        sep = "\t" if file_path.endswith(".tsv") else ","

        sampled_chunks = []
        try:
            # Read in chunks to avoid OOM for large files
            chunk_iter = pd.read_csv(
                file_path,
                sep=sep,
                chunksize=100000,
                on_bad_lines="skip",
                low_memory=False,
            )

            for chunk in chunk_iter:
                # Basic Cleaning: drop rows where all columns are NaN
                chunk.dropna(how="all", inplace=True)

                # Sample the chunk
                if current_fraction < 1.0:
                    sampled_chunk = chunk.sample(frac=current_fraction, random_state=42)
                else:
                    sampled_chunk = chunk
                    
                sampled_chunks.append(sampled_chunk)

            # Combine all sampled chunks
            if sampled_chunks:
                final_df = pd.concat(sampled_chunks, ignore_index=True)

                # Save the sampled data
                final_df.to_csv(output_path, sep=sep, index=False)
                print(f"Saved sampled data to {output_path} (Rows: {len(final_df)})")
            else:
                print(f"Warning: {file_name} was empty after cleaning.")

        except Exception as e:
            print(f"Error processing {file_name}: {str(e)}")


if __name__ == "__main__":
    # Adjust paths based on location
    INPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    OUTPUT_DIR = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "sampled_data")
    )

    print(f"Starting ETL Sampling Process...\nInput: {INPUT_DIR}\nOutput: {OUTPUT_DIR}")
    sample_large_datasets(INPUT_DIR, OUTPUT_DIR, sample_fraction=0.01, threshold_mb=100)
    print("ETL Process Completed!")
