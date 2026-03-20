import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { api } from '../api/client';

export default function RefundPolicyScreen() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const response = await api.getPageContent('refund-policy');
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
                    <Text style={styles.title}>Refund Policy</Text>
                    <Text style={styles.paragraph}>Unable to load content. Please try again later.</Text>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
            <View style={styles.content}>
                <Text style={styles.title}>{content.title}</Text>
                
                {content.content.paragraphs?.map((para: string, index: number) => (
                    <Text key={index} style={styles.paragraph}>
                        {para}
                    </Text>
                ))}

                {content.content.sections?.map((section: any, index: number) => (
                    <View key={index} style={styles.section}>
                        <Text style={styles.subtitle}>{section.title}</Text>
                        
                        {section.content && (
                            <Text style={styles.paragraph}>{section.content}</Text>
                        )}
                        
                        {section.items && section.items.length > 0 && (
                            <View style={styles.listContainer}>
                                {section.items.map((item: string, itemIndex: number) => (
                                    <View key={itemIndex} style={styles.listItem}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.listText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        
                        {section.note && (
                            <View style={styles.noteContainer}>
                                <Text style={styles.noteText}>{section.note}</Text>
                            </View>
                        )}
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
        paddingBottom: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#681412',
        marginBottom: 20,
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#92422B',
        marginTop: 20,
        marginBottom: 12,
        lineHeight: 28,
    },
    paragraph: {
        fontSize: 16,
        color: '#333',
        lineHeight: 26,
        marginBottom: 15,
        textAlign: 'left',
    },
    section: {
        marginBottom: 10,
    },
    listContainer: {
        marginTop: 8,
        marginBottom: 12,
        marginLeft: 5,
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingRight: 10,
    },
    bullet: {
        fontSize: 18,
        color: '#681412',
        marginRight: 10,
        fontWeight: 'bold',
    },
    listText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    noteContainer: {
        backgroundColor: '#FFF5E6',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#E79A66',
    },
    noteText: {
        fontSize: 15,
        color: '#92422B',
        lineHeight: 22,
        fontStyle: 'italic',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
