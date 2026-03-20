'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function AddressPage() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const response = await api.getPageContent('address');
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
                    <h1 className="text-3xl font-bold text-[#681412] mb-6">Registered Address</h1>
                    <p className="text-gray-700">Unable to load content. Please try again later.</p>
                </div>
            </div>
        );
    }

    const addr = content.content || {};

    return (
        <div className="min-h-screen bg-[#FDF8F5] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-[#E79A66]">
                <h1 className="text-3xl font-bold text-[#681412] mb-6">{content.title}</h1>

                <div className="bg-orange-50 p-6 rounded-md border border-[#E79A66]">
                    {addr.companyName && (
                        <h2 className="text-2xl font-bold text-[#681412] mb-2">{addr.companyName}</h2>
                    )}
                    <address className="not-italic text-lg text-gray-700 leading-relaxed">
                        {addr.address?.map((line: string, index: number) => (
                            <React.Fragment key={index}>
                                {line}
                                {index < addr.address.length - 1 && <br />}
                            </React.Fragment>
                        ))}
                        {addr.pinCode && (
                            <>
                                <br />
                                <span className="font-bold">Pin Code: {addr.pinCode}</span>
                            </>
                        )}
                        {addr.country && (
                            <>
                                <br />
                                {addr.country}
                            </>
                        )}
                    </address>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-[#92422B] mb-2">Locate Us</h3>
                    <div className="rounded-md overflow-hidden" style={{ maxWidth: '100%' }}>
                        {addr.mapIframe ? (
                            <div 
                                className="w-full"
                                dangerouslySetInnerHTML={{ __html: addr.mapIframe }}
                                style={{ 
                                    width: '100%',
                                    height: '450px',
                                    maxWidth: '100%'
                                }}
                            />
                        ) : (
                            <div className="bg-gray-200 h-64 rounded-md flex items-center justify-center text-gray-500">
                                [Map Placeholder - Google Maps Integration]
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
