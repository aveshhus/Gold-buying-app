import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { api } from '../api/client';

export default function AboutUsScreen() {
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
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#681412" />
            </View>
        );
    }

    if (!content) {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>About Us</Text>
                    <Text style={styles.paragraph}>Unable to load content. Please try again later.</Text>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{content.title}</Text>

                {content.content.highlight && (
                    <Text style={styles.highlight}>
                        {content.content.highlight}
                    </Text>
                )}

                {content.content.paragraphs?.map((para: string, index: number) => (
                    <Text key={index} style={styles.paragraph}>
                        {para}
                    </Text>
                ))}

                {content.content.sections?.map((section: any, index: number) => (
                    <View key={index}>
                        <Text style={styles.subtitle}>{section.title}</Text>
                        <View style={styles.featureBox}>
                            {section.items?.map((item: any, itemIndex: number) => (
                                <View key={itemIndex}>
                                    <Text style={styles.featureTitle}>• {item.title}</Text>
                                    <Text style={styles.featureDesc}>{item.description}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
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
    highlight: {
        fontSize: 18,
        fontWeight: '600',
        color: '#681412',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#92422B',
        marginTop: 20,
        marginBottom: 15,
    },
    paragraph: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        marginBottom: 10,
    },
    featureBox: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E79A66',
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#681412',
        marginTop: 10,
    },
    featureDesc: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
        marginLeft: 10,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
