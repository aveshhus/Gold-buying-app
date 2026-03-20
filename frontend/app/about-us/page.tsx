'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function AboutUsPage() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const response = await api.getPageContent('about-us');
            if (response.data) {
                setContent(response.data);
            }
        } catch (error) {
            console.error('Error loading content:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDF8F5] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#681412] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="min-h-screen bg-[#FDF8F5] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-[#E79A66]">
                    <h1 className="text-3xl font-bold text-[#681412] mb-6">About Us</h1>
                    <p className="text-gray-700">Unable to load content. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDF8F5] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-[#E79A66]">
                <h1 className="text-3xl font-bold text-[#681412] mb-6">{content.title}</h1>
                <div className="prose prose-stone text-gray-700 space-y-4">
                    {content.content.highlight && (
                        <p className="text-lg font-semibold text-[#681412] italic">
                            {content.content.highlight}
                        </p>
                    )}
                    {content.content.paragraphs?.map((para: string, index: number) => (
                        <p key={index}>{para}</p>
                    ))}
                    {content.content.sections?.map((section: any, index: number) => (
                        <div key={index}>
                            <h2 className="text-xl font-semibold text-[#92422B] mt-4">{section.title}</h2>
                            {section.items && (
                                <ul className="list-disc pl-5 mt-2 space-y-2">
                                    {section.items.map((item: any, itemIndex: number) => (
                                        <li key={itemIndex}>
                                            <strong>{item.title}:</strong> {item.description}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
