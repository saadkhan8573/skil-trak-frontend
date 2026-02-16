import { PuzzleGame } from '@components'
import Head from 'next/head'
import React from 'react'

const Puzzle = () => {
    return (
        <div>
            <Head>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <PuzzleGame />
        </div>
    )
}

export default Puzzle
