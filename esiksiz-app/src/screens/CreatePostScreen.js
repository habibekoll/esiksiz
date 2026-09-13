import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import { Sparkles, ArrowLeft, Edit3, RefreshCw, Check } from 'lucide-react-native';

const SAMPLE_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    caption: 'Görselde TEKNOFEST standında genç mühendisler erişilebilir sosyal medya prototipini jüriye tanıtıyor.',
  },
  {
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    caption: 'Görselde bir grup üniversite öğrencisi kütüphanede yazılım projesi üzerine beyin fırtınası yapıyor.',
  },
];

export const CreatePostScreen = ({ onBack, onPostCreated }) => {
  const { theme, fontSizeScale } = useAccessibility();
  const colors = theme.colors;
  const isVisual = theme.isVisual;

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
    }, 500);
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      accessible={true}
      accessibilityRole="region"
      accessibilityLabel="Yeni Gönderi Paylaşma Ekranı"
    >
      {/* Üst Çubuk */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backBtn,
            { backgroundColor: isVisual ? '#FFE600' : colors.inputBg },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Geri dön"
        >
          <ArrowLeft size={20} color={isVisual ? '#000000' : colors.text} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.text }]}>
          Yeni Gönderi
        </Text>
        <TouchableOpacity
          onPress={handlePublish}
          disabled={!postText.trim()}
          style={[
            styles.publishBtn,
            {
              backgroundColor: postText.trim()
                ? isVisual
                  ? '#FFE600'
                  : colors.primary
                : colors.border,
              minHeight: isVisual ? 48 : 40,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Gönderiyi Paylaş"
        >
          <Text
            style={[
              styles.publishBtnText,
              {
                color: postText.trim()
                  ? isVisual
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
            borderWidth: isVisual ? 2 : 1,
            fontSize: 16 * fontSizeScale,
          },
        ]}
        placeholder="Aklınızdan ne geçiyor? Herkesle paylaşın..."
        placeholderTextColor={colors.textMuted}
        multiline
        value={postText}
        onChangeText={setPostText}
      />

      {/* Görsel Önizlemesi */}
      <View style={styles.imageBox}>
        <Image source={{ uri: selectedImage }} style={styles.previewImg} />
        <TouchableOpacity
          onPress={handleNextSampleImage}
          style={styles.changeBtn}
        >
          <RefreshCw size={14} color="#FFFFFF" />
          <Text style={styles.changeBtnText}>Görseli Değiştir</Text>
        </TouchableOpacity>

        {/* Yapay Zekâ Alt Metin Taslak Kutusu */}
        <View
          style={[
            styles.altBox,
            {
              backgroundColor: isVisual ? '#000000' : colors.inputBg,
              borderColor: isVisual ? '#FFE600' : colors.border,
              borderWidth: isVisual ? 2 : 1,
            },
          ]}
        >
          <View style={styles.altHeader}>
            <View style={styles.aiTag}>
              <Sparkles size={14} color={isVisual ? '#FFE600' : colors.primary} />
              <Text style={[styles.aiTagText, { color: isVisual ? '#FFE600' : colors.primary }]}>
                Yapay Zekâ Alt Metin Taslağı
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsEditingAltText(!isEditingAltText)}
              style={styles.editBtn}
            >
              <Edit3 size={14} color={isVisual ? '#FFE600' : colors.primary} />
              <Text style={[styles.editBtnText, { color: isVisual ? '#FFE600' : colors.primary }]}>
                {isEditingAltText ? 'Tamam' : 'Düzenle'}
              </Text>
            </TouchableOpacity>
          </View>

          {isGeneratingAi ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 8 }} />
          ) : isEditingAltText ? (
            <TextInput
              style={[styles.altInput, { color: colors.text, borderColor: colors.border }]}
              value={generatedAltText}
              onChangeText={setGeneratedAltText}
              multiline
            />
          ) : (
            <Text style={[styles.altText, { color: colors.text, fontSize: 13 * fontSizeScale }]}>
              "{generatedAltText}"
            </Text>
          )}

          <Text style={[styles.altNote, { color: isVisual ? '#FFE600' : '#16A34A' }]}>
            ✓ Görme engelli kullanıcıların ekran okuyucularına Türkçe olarak okunacaktır.
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  publishBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
  },
  publishBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  textInput: {
    minHeight: 85,
    padding: 14,
    borderRadius: 14,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  imageBox: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  previewImg: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  changeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  changeBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  altBox: {
    padding: 12,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  altHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  aiTagText: {
    fontSize: 12,
    fontWeight: '800',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  altText: {
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  altInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    marginBottom: 6,
  },
  altNote: {
    fontSize: 11,
    fontWeight: '700',
  },
});
