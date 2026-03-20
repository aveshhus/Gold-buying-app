# Grance Font Files

## Instructions to Add Grance Font

1. **Download the Grance font files** from one of these sources:
   - **MyFonts**: https://www.myfonts.com/collections/grance-font-salamahtype
   - **Creative Market**: https://creativemarket.com/Salamahtype/7804338-GRANCE-Modern-Serif
   - **Creative Fabrica**: https://www.creativefabrica.com/product/grance/
   - **Dafont** (Personal Use): https://www.dafont.com/grance.font

2. **Place the font files in this directory** (`frontend/public/fonts/`):
   - Grance-Regular.otf (or .ttf, .woff2, .woff)
   - Grance-Medium.otf (optional, for medium weight)
   - Grance-SemiBold.otf (optional, for semi-bold weight)
   - Grance-Bold.otf (optional, for bold weight)

3. **Uncomment the @font-face declarations** in:
   - `frontend/app/globals.css`
   - `public/css/style.css` (for HTML pages)

4. **Update the filenames** in the @font-face declarations to match your actual font files.

5. **Restart your development server** to see the changes.

The font will automatically be applied across the entire project once the files are added and the CSS is updated.

