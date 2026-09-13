import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import { AICaptionService } from '../services/aiCaptionService';
import { Image as ImageIcon, Sparkles, ArrowLeft, Edit3, CheckCircle } from 'lucide-react-native';

export const CreatePostScreen = ({ onBack, onPostCreated }) => {
  const { theme, fontSizeScale } = useAccessibility();
  const colors = theme.colors;

  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState(
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedAltText, setGeneratedAltText] = useState(
    'Görselde TEKNOFEST standında genç mühendisler erişilebilir sosyal medya prototipi üzerinde çalışıyor.'
  );
  const [isEditingAltText, setIsEditingAltText] = useState(false);

  const handleSelectSampleImage = async () => {
    setIsGeneratingAi(true);
    const altText = await AICaptionService.generateAltTextForUpload(selectedImage);
    setGeneratedAltText(altText);
    setIsGeneratingAi(false);
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
      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />

          {/* Yapay Zekâ Otomatik Alt Metin Kutusu (İP3 Çekirdek Özelliği) */}
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
                  Yapay Zekâ Otomatik Alt Metin Taslağı
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
              ✓ Bu metin görme engelli kullanıcıların ekran okuyucularına otomatik okunacaktır.
            </Text>
          </View>
        </View>
      )}

      {/* Farklı Görsel Test Et Butonu */}
      <TouchableOpacity
        onPress={handleSelectSampleImage}
        style={[
          styles.changeImgBtn,
          {
            backgroundColor: isHighContrast ? '#111111' : colors.cardBackground,
            borderColor: colors.border,
            borderWidth: 1,
          },
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Yapay zekâ görsel analizini yeniden çalıştır"
      >
        <ImageIcon size={18} color={colors.text} />
        <Text style={[styles.changeImgText, { color: colors.text }]}>
          Görsel Analizini Yeniden Çalıştır (AI Model)
        </Text>
      </TouchableOpacity>
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
    minHeight: 44, // WCAG 2.2 AA dokunma alanı
    justifyContent: 'center',
  },
  publishBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  textInput: {
    minHeight: 110,
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
    height: 200,
    resizeMode: 'cover',
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
  changeImgBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    minHeight: 48,
  },
  changeImgText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
