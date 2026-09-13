import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import { AICaptionService } from '../services/aiCaptionService';
import { Image as ImageIcon, Sparkles, ArrowLeft, Edit3, CheckCircle, RefreshCw } from 'lucide-react-native';

const SAMPLE_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    caption: 'Görselde TEKNOFEST standında genç mühendisler erişilebilir sosyal medya prototipini jüriye tanıtıyor.',
  },
  {
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    caption: 'Görselde bir grup üniversite öğrencisi dizüstü bilgisayarlarıyla kütüphanede yazılım projesi üzerine beyin fırtınası yapıyor.',
  },
  {
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    caption: 'Görselde teknoloji seminerinde sahnedeki konuşmacı ve salondaki dinleyiciler dikkatle sunumu takip ediyor.',
  },
];

export const CreatePostScreen = ({ onBack, onPostCreated }) => {
  const { theme, fontSizeScale } = useAccessibility();
  const colors = theme.colors;

  const [postText, setPostText] = useState('');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedAltText, setGeneratedAltText] = useState(SAMPLE_IMAGES[0].caption);
  const [isEditingAltText, setIsEditingAltText] = useState(false);

  const selectedImage = SAMPLE_IMAGES[selectedSampleIndex].url;

  const handleNextSampleImage = () => {
    setIsGeneratingAi(true);
    const nextIdx = (selectedSampleIndex + 1) % SAMPLE_IMAGES.length;
    setSelectedSampleIndex(nextIdx);
    setTimeout(() => {
      setGeneratedAltText(SAMPLE_IMAGES[nextIdx].caption);
      setIsGeneratingAi(false);
    }, 600);
  };

  const handlePublish = () => {
    if (!postText.trim()) return;
    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        name: 'SİNAPS Takımı (Ben)',
        handle: '@sinaps_pilot',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      },
      content: postText,
      image: selectedImage,
      aiDescription: generatedAltText,
      videoUrl: null,
      captions: null,
      likes: 1,
      comments: 0,
      timestamp: 'Az önce',
    };
    onPostCreated(newPost);
  };

  const isHighContrast = theme.isHighContrast;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      accessible={true}
      accessibilityRole="region"
      accessibilityLabel="Erişilebilir Gönderi Oluşturma Ekranı"
    >
      {/* Üst Çubuk */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backBtn,
            { backgroundColor: isHighContrast ? '#FFE600' : colors.inputBg },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Geri dön"
        >
          <ArrowLeft size={20} color={isHighContrast ? '#000000' : colors.text} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.text }]}>
          Yeni Gönderi Paylaş
        </Text>
        <TouchableOpacity
          onPress={handlePublish}
          disabled={!postText.trim()}
          style={[
            styles.publishBtn,
            {
              backgroundColor: postText.trim()
                ? isHighContrast
                  ? '#FFE600'
                  : colors.primary
                : colors.border,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Gönderiyi paylaş"
        >
          <Text
            style={[
              styles.publishBtnText,
              {
                color: postText.trim()
                  ? isHighContrast
                    ? '#000000'
                    : '#FFFFFF'
                  : colors.textMuted,
              },
            ]}
          >
            Paylaş
          </Text>
        </TouchableOpacity>
      </View>

      {/* Metin Giriş Alanı */}
      <TextInput
        style={[
          styles.textInput,
          {
            color: colors.text,
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
            borderWidth: isHighContrast ? 2 : 1,
            fontSize: 16 * fontSizeScale,
          },
        ]}
        placeholder="Aklınızdan ne geçiyor? NSosyal ile herkesle paylaşın..."
        placeholderTextColor={colors.textMuted}
        multiline
        value={postText}
        onChangeText={setPostText}
        accessible={true}
        accessibilityLabel="Gönderi metni yazma alanı"
      />

      {/* Seçili Görsel Önizlemesi */}
      <View style={styles.imagePreviewContainer}>
        <Image source={{ uri: selectedImage }} style={styles.previewImage} />

        {/* Farklı Görsel Test Et Butonu */}
        <TouchableOpacity
          onPress={handleNextSampleImage}
          style={styles.changeSampleBtn}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Farklı görsel seç ve yapay zekâ analizini test et"
        >
          <RefreshCw size={14} color="#FFFFFF" />
          <Text style={styles.changeSampleText}>Farklı Görsel Seç & AI Analiz Et</Text>
        </TouchableOpacity>

        {/* Yapay Zekâ Otomatik Alt Metin Kutusu */}
        <View
          style={[
            styles.aiAltBox,
            {
              backgroundColor: isHighContrast ? '#000000' : '#F0FDF4',
              borderColor: isHighContrast ? '#FFE600' : '#86EFAC',
              borderWidth: isHighContrast ? 2 : 1.5,
            },
          ]}
        >
          <View style={styles.aiAltHeader}>
            <View style={styles.aiTagRow}>
              <Sparkles size={16} color={isHighContrast ? '#FFE600' : '#16A34A'} />
              <Text
                style={[
                  styles.aiTagText,
                  { color: isHighContrast ? '#FFE600' : '#15803D' },
                ]}
              >
                Yapay Zekâ Türkçe Alt Metin Taslağı
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setIsEditingAltText(!isEditingAltText)}
              style={styles.editAltBtn}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Yapay zekanın ürettiği alt metni düzenle"
            >
              <Edit3 size={14} color={isHighContrast ? '#FFE600' : '#15803D'} />
              <Text
                style={[
                  styles.editAltText,
                  { color: isHighContrast ? '#FFE600' : '#15803D' },
                ]}
              >
                {isEditingAltText ? 'Bitti' : 'Düzenle'}
              </Text>
            </TouchableOpacity>
          </View>

          {isGeneratingAi ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 10 }} />
          ) : isEditingAltText ? (
            <TextInput
              style={[
                styles.altInput,
                {
                  color: colors.text,
                  backgroundColor: colors.inputBg,
                  borderColor: colors.border,
                },
              ]}
              value={generatedAltText}
              onChangeText={setGeneratedAltText}
              multiline
              accessible={true}
              accessibilityLabel="Alt metni düzenleme kutusu"
            />
          ) : (
            <Text
              style={[
                styles.altPreviewText,
                { color: isHighContrast ? '#FFFFFF' : '#166534' },
              ]}
            >
              "{generatedAltText}"
            </Text>
          )}

          <Text
            style={[
              styles.altHint,
              { color: isHighContrast ? '#FFE600' : '#16A34A' },
            ]}
          >
            ✓ Görme engellilerin ekran okuyucularına Türkçe olarak okunacaktır.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  publishBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minHeight: 44,
    justifyContent: 'center',
  },
  publishBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  textInput: {
    minHeight: 90,
    padding: 14,
    borderRadius: 14,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  imagePreviewContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
  },
  previewImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  changeSampleBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  changeSampleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  aiAltBox: {
    padding: 14,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  aiAltHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiTagText: {
    fontSize: 12,
    fontWeight: '800',
  },
  editAltBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 36,
    paddingHorizontal: 8,
  },
  editAltText: {
    fontSize: 12,
    fontWeight: '700',
  },
  altPreviewText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  altInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    marginBottom: 8,
  },
  altHint: {
    fontSize: 11,
    fontWeight: '700',
  },
});
