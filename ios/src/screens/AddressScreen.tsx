import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { api } from '../api/client';

export default function AddressScreen() {
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
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#681412" />
            </View>
        );
    }

    if (!content) {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Registered Address</Text>
                    <Text style={styles.paragraph}>Unable to load content. Please try again later.</Text>
                </View>
            </ScrollView>
        );
    }

    const addr = content.content || {};

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{content.title}</Text>

                <View style={styles.card}>
                    {addr.companyName && (
                        <Text style={styles.companyName}>{addr.companyName}</Text>
                    )}
                    {addr.address?.map((line: string, index: number) => (
                        <Text key={index} style={styles.addressText}>
                            {line}
                        </Text>
                    ))}
                    {addr.pinCode && (
                        <Text style={styles.pinCode}>Pin Code: {addr.pinCode}</Text>
                    )}
                    {addr.country && (
                        <Text style={styles.country}>{addr.country}</Text>
                    )}
                </View>

                <Text style={styles.subtitle}>Locate Us</Text>
                <View style={styles.mapPlaceholder}>
                    <Text style={styles.mapText}>[Map View]</Text>
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
    card: {
        backgroundColor: '#FFF8F0',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E79A66',
        marginBottom: 25,
    },
    companyName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#681412',
        marginBottom: 10,
    },
    addressText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    pinCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
        marginBottom: 4,
    },
    country: {
        fontSize: 16,
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#92422B',
        marginBottom: 10,
    },
    mapPlaceholder: {
        height: 200,
        backgroundColor: '#ddd',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapText: {
        color: '#666',
        fontSize: 16,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    paragraph: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        marginBottom: 10,
    }
});
