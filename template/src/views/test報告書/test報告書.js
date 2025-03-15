import React, { useRef, useEffect } from 'react'
import { useState } from 'react';


import '../../scss/碳盤查系統.css'
import styles from '../../scss/盤查報告書.module.css'

import 'primereact/resources/themes/saga-blue/theme.css';  // 主题样式
import 'primereact/resources/primereact.min.css';          // 核心 CSS
import 'primeicons/primeicons.css';                        // 图标样式

import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { getDocument } from 'pdfjs-dist';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


const Tabs = () => {
    const pdfFile = '/pdf/combined.pdf';
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [chapterPages, setChapterPages] = useState({});
    const [viewerKey, setViewerKey] = useState(0); // 強迫重新渲染用
    const [targetPage, setTargetPage] = useState(null); // 目標頁面

    // 解析章節
    useEffect(() => {
        const extractTextFromPDF = async () => {
            try {
                const pdf = await getDocument(pdfFile).promise;
                let textContent = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();
                    const textItems = text.items.map((item) => item.str).join(' ');

                    if (textItems.includes('第一章')) {
                        textContent.push({ chapter: '第一章', page: i });
                    }
                    if (textItems.includes('第二章')) {
                        textContent.push({ chapter: '第二章', page: i });
                    }
                }

                const chapters = {};
                textContent.forEach(({ chapter, page }) => {
                    chapters[chapter] = page;
                });

                setChapterPages(chapters);
            } catch (error) {
                console.error('解析 PDF 錯誤:', error);
            }
        };

        extractTextFromPDF();
    }, [pdfFile]);

    // ** 重新渲染 PDF 並跳到指定頁 **
    const goToPage = (pageNumber) => {
        setTargetPage(pageNumber);
        setViewerKey((prev) => prev + 1); // 透過 key 重新渲染
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>PDF 文件檢視器</h2>

            {/* 動態生成按鈕 */}
            <div style={{ marginBottom: '10px' }}>
                {Object.entries(chapterPages).map(([chapter, page]) => (
                    <button
                        key={chapter}
                        onClick={() => goToPage(page)}
                        style={{ margin: '5px' }}
                    >
                        跳到 {chapter}
                    </button>
                ))}
            </div>

            {/* PDF 顯示區 */}
            <div style={{ width: '80%', height: '600px', border: '1px solid #ccc' }}>
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                    <Viewer
                        key={viewerKey}
                        fileUrl={pdfFile}
                        defaultScale={SpecialZoomLevel.PageFit}
                        initialPage={targetPage ? targetPage - 1 : 0} // 透過 initialPage 跳轉
                        plugins={[defaultLayoutPluginInstance]}
                    />
                </Worker>
            </div>
        </div>
    );
}

export default Tabs;
