import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { SpeechService } from '../services/speechService';
import { Volume2, VolumeX, Heart, MessageCircle, Share2, Sparkles, Play, Pause, Bookmark } from 'lucide-react-native';

export const FeedCard = ({ post }) => {
  const { theme, currentMode, fontSizeScale } = useAccessibility();
  const colors = theme.colors;

  const [isReadingCaption, setIsReadingCaption] = useState(false);
  const [showAiCaption, setShowAiCaption] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  // Video oynatılırken altyazı akışı
  useEffect(() => {
    let timer;
    if (isPlayingVideo && post.captions && post.captions.length > 0) {
      timer = setInterval(() => {
        setCurrentCaptionIndex((prev) => (prev + 1) % post.captions.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlayingVideo, post.captions]);

  // Görsel Açıklamasını Sesli Oku
  const handleToggleSpeakCaption = () => {
    if (isReadingCaption) {
      SpeechService.stop();
      setIsReadingCaption(false);
    } else {
      setShowAiCaption(true);
      setIsReadingCaption(true);
      SpeechService.speak(
        post.aiDescription,
        () => setIsReadingCaption(true),
        () => setIsReadingCaption(false),
        () => setIsReadingCaption(false)
      );
    }
  };

  const isHighContrast = theme.isHighContrast;
  const isHearing = currentMode === MODES.HEARING;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: isHighContrast ? '#FFE600' : colors.cardBorder,
          borderWidth: isHighContrast ? 2 : 1,
        },
      ]}
      accessible={true}
      accessibilityRole="article"
      accessibilityLabel={`${post.author.name} gönderisi: ${post.content}`}
    >
      {/* Kullanıcı Başlığı */}
      <View style={styles.authorRow}>
        <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: colors.text, fontSize: 15 * fontSizeScale }]}>
            {post.author.name}
          </Text>
          <Text style={[styles.authorHandle, { color: colors.textMuted, fontSize: 12 * fontSizeScale }]}>
            {post.author.handle} • {post.timestamp}
          </Text>
        </View>
      </View>

      {/* Gönderi Metni */}
      <Text
        style={[
          styles.postText,
          {
            color: colors.text,
            fontSize: 15 * fontSizeScale,
            lineHeight: 22 * fontSizeScale,
          },
        ]}
      >
        {post.content}
      </Text>

      {/* 1. Görsel ve Erişilebilir Açıklama */}
      {post.image && (
        <View style={styles.mediaWrapper}>
          <Image source={{ uri: post.image }} style={styles.mediaImage} />

          {/* Görselin Üzerinde Zarif "Görseli Açıkla" Butonu */}
          <TouchableOpacity
            onPress={() => setShowAiCaption(!showAiCaption)}
            style={[
              styles.aiTriggerBtn,
              {
                backgroundColor: showAiCaption ? (isHighContrast ? '#FFE600' : '#2563EB') : 'rgba(15, 23, 42, 0.85)',
              },
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Görselin yapay zekâ betimlemesini göster"
          >
            <Sparkles size={14} color={showAiCaption && isHighContrast ? '#000000' : '#FFFFFF'} />
            <Text
              style={[
                styles.aiTriggerText,
                { color: showAiCaption && isHighContrast ? '#000000' : '#FFFFFF' },
              ]}
            >
              {showAiCaption ? 'Betimlemeyi Gizle' : 'Görseli Açıkla (AI)'}
            </Text>
          </TouchableOpacity>

          {/* Açılan Temiz Betimleme Kutusu */}
          {showAiCaption && (
            <View
              style={[
                styles.captionBox,
                {
                  backgroundColor: isHighContrast ? '#000000' : colors.inputBg,
                  borderColor: isHighContrast ? '#FFE600' : colors.border,
                },
              ]}
            >
              <View style={styles.captionTopRow}>
                <Text style={[styles.captionBadge, { color: isHighContrast ? '#FFE600' : colors.primary }]}>
                  Türkçe Görsel Betimlemesi
                </Text>
                <TouchableOpacity
                  onPress={handleToggleSpeakCaption}
                  style={[
                    styles.listenBtn,
                    { backgroundColor: isReadingCaption ? '#EF4444' : isHighContrast ? '#FFE600' : colors.primary },
                  ]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Betimlemeyi sesli dinle"
                >
                  {isReadingCaption ? (
                    <VolumeX size={14} color={isHighContrast ? '#000000' : '#FFFFFF'} />
                  ) : (
                    <Volume2 size={14} color={isHighContrast ? '#000000' : '#FFFFFF'} />
                  )}
                  <Text style={[styles.listenBtnText, { color: isHighContrast ? '#000000' : '#FFFFFF' }]}>
                    {isReadingCaption ? 'Durdur' : 'Seslendir'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.captionContent, { color: colors.text, fontSize: 13 * fontSizeScale }]}>
                {post.aiDescription}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* 2. Video ve Canlı Altyazı */}
      {post.videoUrl && (
        <View style={styles.mediaWrapper}>
          <Image source={{ uri: post.videoPoster }} style={styles.mediaImage} />
          <TouchableOpacity
            onPress={() => setIsPlayingVideo(!isPlayingVideo)}
            style={[
              styles.playBtn,
              { backgroundColor: isHighContrast ? '#FFE600' : '#2563EB' },
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isPlayingVideo ? 'Videoyu duraklat' : 'Videoyu oynat'}
          >
            {isPlayingVideo ? (
              <Pause size={24} color={isHighContrast ? '#000000' : '#FFFFFF'} />
            ) : (
              <Play size={24} color={isHighContrast ? '#000000' : '#FFFFFF'} />
            )}
          </TouchableOpacity>

          {/* Gerçekçi Altyazı Şeridi */}
          <View style={styles.videoSubtitleBar}>
            <Text style={styles.videoSubtitleText}>
              {post.captions[currentCaptionIndex].text}
            </Text>
          </View>
        </View>
      )}

      {/* Etkileşim Butonları */}
      <View style={[styles.actionsRow, { borderTopColor: colors.border }]}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            onPress={() => {
              setLiked(!liked);
              setLikeCount(liked ? likeCount - 1 : likeCount + 1);
            }}
            style={styles.actionItem}
          >
            <Heart
              size={20}
              color={liked ? '#EF4444' : isHighContrast ? '#FFE600' : colors.textMuted}
              fill={liked ? '#EF4444' : 'none'}
            />
            <Text style={[styles.actionCount, { color: colors.text }]}>{likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <MessageCircle size={20} color={isHighContrast ? '#FFE600' : colors.textMuted} />
            <Text style={[styles.actionCount, { color: colors.text }]}>{post.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Share2 size={20} color={isHighContrast ? '#FFE600' : colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setSaved(!saved)} style={styles.actionItem}>
          <Bookmark
            size={20}
            color={saved ? colors.primary : isHighContrast ? '#FFE600' : colors.textMuted}
            fill={saved ? colors.primary : 'none'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontWeight: '700',
  },
  authorHandle: {
    marginTop: 2,
  },
  postText: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  mediaWrapper: {
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  aiTriggerBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  aiTriggerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  captionBox: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  captionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  captionBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  listenBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  captionContent: {
    lineHeight: 18,
  },
  playBtn: {
    position: 'absolute',
    top: '38%',
    left: '42%',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  videoSubtitleBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  videoSubtitleText: {
    color: '#FFE600',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: 40,
    minWidth: 40,
  },
  actionCount: {
    fontSize: 13,
    fontWeight: '600',
  },
});
