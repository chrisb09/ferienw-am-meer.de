import json
import openai
import time
import os

import deepl

from hyphens import add_hyphens

characters_translated = 0

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
        
        
class Translator():

    def translate(text, language):
        raise NotImplementedError()
    
class OpenAITranslator(Translator):
    
    def __init__(self):
        openai_api_key = load_api_key("tools/.openai_api_key")
        openai.api_key = openai_api_key
        
    def translate(self, text, language):
        line_breaks = ""
        if "</br>" in text:
            line_breaks="Also include line breaks (</br>) in the translated text at the proper position."
        # Call OpenAI's GPT model to translate the text
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful translator."},
                {
                    "role": "user",
                    "content": f"Translate the following text into {language}. Keep the meaning intact while also providing a natural and professional translation. Encode the text in a way that it does not interfere with html. {line_breaks} Ensure the translation length doesn't massively exceed the original text. Return only the translation and nothing else. Remember, the target language is {language}. The text to translate is: {text}",
                },
            ],
            max_tokens=1000,
        )

        # Extract the translated text from the response
        return response['choices'][0]['message']['content']
        
class DeeplTranslator(Translator):
    
    translator = None
    def __init__(self):
        deepl_api_key = load_api_key("tools/.deepl_api_key")
        self.translator = deepl.Translator(deepl_api_key)
        
    def translate(self, text, language):
        global characters_translated
        result = self.translator.translate_text(text, target_lang=language.upper() + ("-GB" if language.upper() == "EN" else "") +("-PT" if language.upper() == "PT" else ""))
        characters_translated += result.billed_characters
        return result.text

# Function to translate content using OpenAI's API
def translate_content(json_file, json_file_old, language_code, output_file, translator):

    # Load the JSON data
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    # Load the JSON data
    
    if os.path.exists(json_file_old):
        with open(json_file_old, "r", encoding="utf-8") as f:
            data_old = json.load(f)
    else:
        data_old = {}
        
    if os.path.exists(output_file):
        with open(output_file, "r", encoding="utf-8") as f:
            translations_old = json.load(f)
    else:
        translations_old = {}

    # Dictionary to hold the translated content
    translations = {}
    
    translations["scale"] = 1.0
    
    original_navbar_size = sum([len(data[x]) for x in filter(lambda y: y.startswith("navlink") or y == "logo", data.keys())])
    translated_navbar_size = 0

    # Iterate over each id and content in the JSON
    for element_id, text in data.items():
        if element_id in data_old and data_old[element_id] == data[element_id] and element_id in translations_old:
            print(f"  {element_id} has not changed, no need to retranslate it.")
            translations[element_id] = translations_old[element_id]
        else:
            try:
                translated_text = translator.translate(text, language_code)

                # Save the translated text to the dictionary
                translations[element_id] = add_hyphens(translated_text.strip(), lang=language_code)
                
                print(f"  translated {element_id}")

            except Exception as e:
                print(f"  error translating {element_id}: {e}")
                translations[element_id] = None
        if element_id.startswith("navlink") or element_id == "logo":
            translated_navbar_size += len(translations[element_id])
            #translations["scale"] = min(translations["scale"], len(text)/len(translated_text))
    translations["scale"] = max(1,original_navbar_size) / max(1,translated_navbar_size)
    # Save the translations to a new JSON file
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(translations, f, ensure_ascii=False, indent=4)

    print("-"*40)
    print(f"Translations saved to {output_file}")
    print()

# Example usage
if __name__ == "__main__":
    # Load the OpenAI API key from a hidden file
    if True:
        translator = DeeplTranslator()
    else:
        translator = OpenAITranslator()

    # Input JSON file (from the previous script)
    input_json_file = "translations/de.json"
    input_json_file_old = "translations/de_old.json"

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
    
    
    
    
    characters_translated = 0
    start = time.time()

    # Iterate over the language codes and translate the content
    for language_code, language_name in languages.items():
        output_json_file = f"translations/{language_code}.json"
        print(f"Translate to {language_name}")
        translate_content(input_json_file, input_json_file_old, language_code, output_json_file, translator)

    print("Done. Deepl billed "+str(characters_translated)+" in "+"{:.1f}".format(time.time()-start))