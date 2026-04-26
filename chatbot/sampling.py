import pandas as pd
import os
import glob


def sample_large_datasets(input_dir, output_dir, sample_fraction=0.01):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # We are looking for large .tsv and .csv files
    tsv_files = glob.glob(os.path.join(input_dir, "*.tsv"))
    csv_files = glob.glob(os.path.join(input_dir, "*.csv"))

    all_files = tsv_files + csv_files

    for file_path in all_files:
        file_name = os.path.basename(file_path)
        output_path = os.path.join(output_dir, f"sampled_{file_name}")

        print(f"Processing {file_name}...")

        # Determine separator
        sep = "\t" if file_path.endswith(".tsv") else ","

        sampled_chunks = []
        try:
            # Read in chunks to avoid OOM for large files
            chunk_iter = pd.read_csv(
                file_path,
                sep=sep,
                chunksize=50000,
                on_bad_lines="skip",
                low_memory=False,
            )

            for chunk in chunk_iter:
                # Basic Cleaning: drop rows where all columns are NaN
                chunk.dropna(how="all", inplace=True)

                # Sample the chunk
                sampled_chunk = chunk.sample(frac=sample_fraction, random_state=42)
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
    sample_large_datasets(INPUT_DIR, OUTPUT_DIR, sample_fraction=0.01)
    print("ETL Process Completed!")
