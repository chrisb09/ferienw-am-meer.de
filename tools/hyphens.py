import pyphen

def add_hyphens(text, lang, hyphen="­"):
    if not lang in pyphen.LANGUAGES_LOWERCASE:
        return text
    dic = pyphen.Pyphen(lang=lang)
    if "­" in text:
        text = text.replace("­", "")
    if "&shy;" in text:
        text = text.replace("&shy;", "")
    return " ".join([dic.inserted(t, hyphen="­") for t in text.split()])

if __name__ == "__main__":
    test_text = "Bei­de Woh­nun­gen lie­gen di­rekt ne­ben­ein­an­der in der 4. Eta­ge und sind mit ei­nem Fahr­stuhl er­reich­ba­r. Durch einen se­pa­ra­ten Ein­gang ist ein bar­rie­re­frei­es Er­rei­chen der Woh­nung mög­lich. Die 50 qm tei­len sich auf in ein Wohn­zim­mer mit Kü­chen­zei­le, ein Schlaf­zim­mer mit Dop­pel­bet­t, Du­sche, Flur, Ab­stell­raum und einen 6m lan­gen, über­dach­ten Bal­kon. Die Woh­nung ist kom­plett aus­ge­stat­tet. Soll­te et­was feh­len, sor­ge ich ger­ne fü"
    print(add_hyphens(test_text, "de"))