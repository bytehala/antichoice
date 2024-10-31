import tabula
import pandas as pd

# Replace with the path to your PDF file
pdf_path = "/Users/lemclio/bytehala/mybodyca/src/data/pdf_source/list-anti-choice-groups.pdf"

# Extract tables from the PDF, this returns a list of DataFrames
tables = tabula.read_pdf(pdf_path, pages="all", multiple_tables=True)

# Concatenate all tables into one DataFrame
combined_table = pd.concat(tables, ignore_index=True)

# Save the combined DataFrame to a single CSV file
combined_table.to_csv("output_combined.csv", index=False)
