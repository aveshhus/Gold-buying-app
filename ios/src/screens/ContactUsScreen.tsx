import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { api } from '../api/client';

export default function ContactUsScreen() {
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

    const handleEmail = () => {
        const email = content?.content?.contact?.email || 'support@goldapp.com';
        Linking.openURL(`mailto:${email}`);
    };

    const handleCall = () => {
        const phone = content?.content?.contact?.phone || '+919876543210';
        Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#681412" />
            </View>
        );
    }

    if (!content) {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Contact Us</Text>
                    <Text style={styles.paragraph}>Unable to load content. Please try again later.</Text>
                </View>
            </ScrollView>
        );
    }

    const contact = content.content.contact || {};

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{content.title}</Text>
                {content.content.description && (
                    <Text style={styles.paragraph}>
                        {content.content.description}
                    </Text>
                )}

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Customer Support</Text>

                    {contact.email && (
                        <TouchableOpacity style={styles.row} onPress={handleEmail}>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.link}>{contact.email}</Text>
                        </TouchableOpacity>
                    )}

                    {contact.phone && (
                        <TouchableOpacity style={styles.row} onPress={handleCall}>
                            <Text style={styles.label}>Phone:</Text>
                            <Text style={styles.link}>{contact.phone}</Text>
                        </TouchableOpacity>
                    )}

                    {contact.hours && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Hours:</Text>
                            <Text style={styles.value}>{contact.hours}</Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF8F5',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#681412',
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderColor: '#E79A66',
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#92422B',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
    },
    label: {
        width: 60,
        fontWeight: '600',
        color: '#555',
    },
    link: {
        fontSize: 16,
        color: '#0066CC',
        fontWeight: '500',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
