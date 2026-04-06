import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { url } = req.query

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Missing url parameter' })
    }

    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream',
            headers: {
                // Mimic a browser to avoid some bot protections
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        })

        res.setHeader(
            'Content-Type',
            response.headers['content-type'] || 'application/octet-stream'
        )
        response.data.pipe(res)
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch image' })
    }
}
