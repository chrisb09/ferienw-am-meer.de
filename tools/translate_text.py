import json
import openai

# Function to load the OpenAI API key from a local file
def load_api_key(file_path):
    try:
        with open(file_path, "r") as f:
            return f.read().strip()  # Read and remove any surrounding whitespace
    except FileNotFoundError:
        print(f"Error: API key file '{file_path}' not found.")
        exit(1)
    except Exception as e:
        print(f"Error reading API key: {e}")
        exit(1)

# Function to translate content using OpenAI's API
def translate_content(json_file, language, output_file, openai_api_key):
    # Set up the OpenAI API key
    openai.api_key = openai_api_key

    # Load the JSON data
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Dictionary to hold the translated content
    translations = {}

    # Iterate over each id and content in the JSON
    for element_id, text in data.items():
        try:
            hyphens="E"
            if "­" in text:
                 hyphens="Add soft hyphens (­) at grammatically correct places, and e"
            # Call OpenAI's GPT model to translate the text
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful translator."},
                    {
                        "role": "user",
                        "content": f"Translate the following text into {language}. Keep the meaning intact while also providing a natural and professional translation.{hyphens}ncode the text in a way that it does not interfere with html. Ensure the translation length doesn't massively exceed the original text. Return only the translation and nothing else. Remember, the target language is {language}. The text to translate is: {text}",
                    },
                ],
                max_tokens=1000,
            )

            # Extract the translated text from the response
            translated_text = response['choices'][0]['message']['content']

            # Save the translated text to the dictionary
            translations[element_id] = translated_text.strip()

            print(f"  translated {element_id}")

        except Exception as e:
            print(f"  error translating {element_id}: {e}")
            translations[element_id] = None

    # Save the translations to a new JSON file
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(translations, f, ensure_ascii=False, indent=4)

    print("-"*40)
    print(f"Translations saved to {output_file}")
    print()

# Example usage
if __name__ == "__main__":
    # Load the OpenAI API key from a hidden file
    openai_api_key = load_api_key("tools/.openai_api_key")

    # Input JSON file (from the previous script)
    input_json_file = "translations/de.json"

    # Define the languages to translate to
    languages = {
        "en": "English",
        "fr": "French",
        "es": "Spanish",
        "pt": "Portuguese",
        "nl": "Dutch",
        "uk": "Ukrainian",
        "tr": "Turkish",
        "it": "Italian",
        "pl": "Polish",
        "da": "Danish",
    }

    # Iterate over the language codes and translate the content
    for language_code, language_name in languages.items():
        output_json_file = f"translations/{language_code}.json"
        print(f"Translate to {language_name}")
        translate_content(input_json_file, language_name, output_json_file, openai_api_key)
