import { isBrowser } from 'utils/browser-supported'

export const htmltotext = (value: string) => {
    return value?.replace(/<([A-z]+)([^>^/]*)>\s*<\/\1>/gim, '')
}

export const HtmlToPlainText = (html: string) => {
    if (!html) return ''
    
    // Use an isomorphic regex approach for both SSR and CSR to guarantee text exact match
    // and prevent React hydration mismatch errors due to whitespace or parsing differences.
    return html
        .replace(/<[^>]*>?/gm, '')
        .replace(/&nbsp;/ig, ' ')
        .replace(/&amp;/ig, '&')
        .replace(/&quot;/ig, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/ig, '<')
        .replace(/&gt;/ig, '>')
        .replace(/\s+/g, ' ') // Collapse multiple whitespace to single space
        .trim()
}

export const plainTextWithSpaces = (html: string) => {
    // Create a temporary div element to parse the HTML string
    // const div = document.createElement('div')
    // div.innerHTML = html

    // // Extract the text content from the div, fallback to an empty string
    // let plainText = div.textContent || div.innerText || ''

    // // Remove all non-breaking spaces, extra spaces, and trim the result
    // plainText = plainText.replace(/[\s\n\r]+/g, ' ').trim() // Collapse all white spaces into a single space
    const div = document.createElement('div')
    div.innerHTML = html

    // Extract the text content from the div, fallback to an empty string
    let plainText = div.textContent || div.innerText || ''

    // Replace multiple spaces, newlines, and non-breaking spaces with a single space
    plainText = plainText.replace(/\s+/g, ' ').trim() // Remove excess spaces/newlines
    plainText = plainText.replace(/&nbsp;/g, ' ') // Replace non-breaking spaces (&nbsp;)

    return plainText

    return plainText
}
