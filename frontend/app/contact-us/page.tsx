'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function ContactUsPage() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const response = await api.getPageContent('contact-us');
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
                    <h1 className="text-3xl font-bold text-[#681412] mb-6">Contact Us</h1>
                    <p className="text-gray-700">Unable to load content. Please try again later.</p>
                </div>
            </div>
        );
    }

    const contact = content.content.contact || {};

    return (
        <div className="min-h-screen bg-[#FDF8F5] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-[#E79A66]">
                <h1 className="text-3xl font-bold text-[#681412] mb-6">{content.title}</h1>
                <div className="text-gray-700 space-y-6">
                    {content.content.description && (
                        <p>{content.content.description}</p>
                    )}

                    <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-[#92422B] mb-4">Customer Support</h2>
                        <div className="space-y-3">
                            {contact.email && (
                                <p className="flex items-center">
                                    <span className="font-semibold w-24">Email:</span>
                                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
                                </p>
                            )}
                            {contact.phone && (
                                <p className="flex items-center">
                                    <span className="font-semibold w-24">Phone:</span>
                                    <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-blue-600 hover:underline">{contact.phone}</a>
                                </p>
                            )}
                            {contact.hours && (
                                <p className="flex items-center">
                                    <span className="font-semibold w-24">Hours:</span>
                                    <span>{contact.hours}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
