'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface InformationViewProps {
  pageId: string;
  title: string;
}

function InformationView({ pageId, title }: InformationViewProps) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, [pageId]);

  const loadContent = async () => {
    try {
      const response = await api.getPageContent(pageId);
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#681412] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="py-12">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-[#E79A66]">
          <h1 className="text-3xl font-bold text-[#681412] mb-6">{title}</h1>
          <p className="text-gray-700">Unable to load content. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Handle different page types
  if (pageId === 'address') {
    const addr = content.content || {};
    return (
      <div className="py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#681412] mb-6">{content.title}</h1>

          <div className="bg-orange-50 p-6 rounded-md border border-[#E79A66] mb-6">
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

  if (pageId === 'contact-us') {
    const contact = content.content.contact || {};
    return (
      <div className="py-6">
        <div className="max-w-3xl mx-auto">
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

  // Default rendering for other pages (about-us, terms, refund-policy, charge-back)
  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#681412] mb-6">{content.title}</h1>
        <div className="prose prose-stone text-gray-700 space-y-4">
          {content.content.highlight && (
            <p className="text-lg font-semibold text-[#681412] italic">
              {content.content.highlight}
            </p>
          )}
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
                  {section.items.map((item: any, itemIndex: number) => {
                    if (typeof item === 'string') {
                      return (
                        <li key={itemIndex} className="flex items-start">
                          <span className="text-[#681412] font-bold mr-3 mt-1">•</span>
                          <span className="text-base leading-relaxed flex-1">{item}</span>
                        </li>
                      );
                    } else {
                      return (
                        <li key={itemIndex} className="flex items-start">
                          <span className="text-[#681412] font-bold mr-3 mt-1">•</span>
                          <span className="text-base leading-relaxed flex-1">
                            <strong>{item.title}:</strong> {item.description}
                          </span>
                        </li>
                      );
                    }
                  })}
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

export function AboutUsView() {
  return <InformationView pageId="about-us" title="About Us" />;
}

export function ContactUsView() {
  return <InformationView pageId="contact-us" title="Contact Us" />;
}

export function AddressView() {
  return <InformationView pageId="address" title="Registered Address" />;
}

export function TermsView() {
  return <InformationView pageId="terms" title="Terms & Conditions" />;
}

export function RefundPolicyView() {
  return <InformationView pageId="refund-policy" title="Refund Policy" />;
}

export function ChargeBackView() {
  return <InformationView pageId="chargeback-policy" title="Chargeback Policy" />;
}

