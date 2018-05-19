'use strict';

import Document, { Head, Main, NextScript } from 'next/document';

/* eslint-disable react/react-in-jsx-scope */

export default class MyDocument extends Document {
    render() {
        return (
            <html>
                <Head>
                    <link rel="stylesheet" href="/_next/static/style.css" />
                    <link rel="shortcut icon" href="/static/favicon.png" type="image/png" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
