'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function ChargeBackPage() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const response = await api.getPageContent('chargeback-policy');
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
                    <h1 className="text-3xl font-bold text-[#681412] mb-6">Chargeback Policy</h1>
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
                    {content.content.paragraphs?.map((para: string, index: number) => (
                        <p key={index} className="text-base leading-relaxed">{para}</p>
                    ))}
                    {content.content.sections?.map((section: any, index: number) => (
                        <div key={index} className="mt-6">
                            <h2 className="text-xl font-semibold text-[#92422B] mt-6 mb-3">{section.title}</h2>
                            {section.content && (
                                <p className="text-base leading-relaxed mb-3">{section.content}</p>
                            )}
                            {section.items && section.items.length > 0 && (
                                <ul className="list-none space-y-2 ml-2">
                                    {section.items.map((item: string, itemIndex: number) => (
                                        <li key={itemIndex} className="flex items-start">
                                            <span className="text-[#681412] font-bold mr-3 mt-1">•</span>
                                            <span className="text-base leading-relaxed flex-1">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {section.note && (
                                <div className="bg-[#FFF5E6] border-l-4 border-[#E79A66] p-4 rounded mt-4">
                                    <p className="text-[#92422B] italic text-sm leading-relaxed">{section.note}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
