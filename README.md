# Methodology

1. Read the PDF using pdf_to_csv.py
2. The output will be mangled CSV, clean it up by removing the ones that say `Type,Type,` so that only actual data remains
3. The remaining data is still mangled, clean it up further with combine_cells.ipynb, then check the data against the original pdf
4. Export to cpc_list.tsv
5. Run `yarn generateData` which will create the JSON file

# Running Locally
`yarn dev`
