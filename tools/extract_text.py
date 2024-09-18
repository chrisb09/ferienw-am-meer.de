import json
from bs4 import BeautifulSoup

from hyphens import add_hyphens

# Function to find translateable elements and save them to a JSON file
def extract_translateable_elements(html_content, output_json_file):
    # Parse the HTML content with BeautifulSoup
    soup = BeautifulSoup(html_content, 'lxml')

    # Find all elements with the class 'translateable'
    elements = soup.find_all(class_='translateable')

    # Dictionary to hold {id: content}
    translations = {}

    # Iterate over each element and extract id and content
    for element in elements:
        # Get the element's id
        element_id = element.get('id')

        # Only include elements with an id attribute
        if element_id:
            # Get the text content of the element
            element_content = element.get_text(strip=True)
            print(len(element_content), end="")
            #element_content = element_content.replace("\r\n", "").replace("\n", "")
            while "  " in element_content:
                element_content = element_content.replace("  ", " ")
            print(f" -> {len(element_content)}")
            # Add the id and content to the dictionary
            translations[element_id] = element_content
            
            
            element.clear()  # Clear the current content of the element
            element.append(add_hyphens(element_content, "de"))  # Set the new text content

    # Save the dictionary to a JSON file
    with open(output_json_file, 'w', encoding='utf-8') as f:
        json.dump(translations, f, ensure_ascii=False, indent=4)
    
    with open('index.html', 'w', encoding='utf-8') as file:
        file.write(str(soup.prettify()))

    print(f"Translations saved to {output_json_file}")
    print("Original HTML file 'index.html' has been overwritten with the modified content")


# Example usage
if __name__ == "__main__":
    # Load your HTML content from a file or a string
    with open('index.html', 'r', encoding='utf-8') as file:
        html_content = file.read()

    # Output JSON file name
    output_json_file = 'translations/de.json'

    # Extract and save the translateable elements
    extract_translateable_elements(html_content, output_json_file)
