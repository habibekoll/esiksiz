import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { SpeechService } from '../services/speechService';
import { Volume2, VolumeX, Heart, MessageCircle, Share2, Sparkles, Subtitles, Play, Pause, Activity } from 'lucide-react-native';

export const FeedCard = ({ post }) => {
  const { theme, currentMode, fontSizeScale, bionicReadingEnabled, setIsSpeaking, setSpeakingText } = useAccessibility();
  const colors = theme.colors;

  const [isReadingCaption, setIsReadingCaption] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  // Video simülasyonu için altyazı döngüsü
  useEffect(() => {
    let timer;
    if (isPlayingVideo && post.captions && post.captions.length > 0) {
      timer = setInterval(() => {
        setCurrentCaptionIndex((prev) => (prev + 1) % post.captions.length);
      }, 3200);
    }
    return () => clearInterval(timer);
  }, [isPlayingVideo, post.captions]);

  // Görsel Açıklamasını Türkçe Sesli Oku
  const handleToggleSpeakCaption = () => {
    if (isReadingCaption) {
      SpeechService.stop();
      setIsReadingCaption(false);
      setIsSpeaking(false);
      setSpeakingText('');
    } else {
      setIsReadingCaption(true);
      setIsSpeaking(true);
      const textToRead = `Görselin Yapay Zekâ Betimlemesi: ${post.aiDescription}`;
      setSpeakingText(textToRead);

      SpeechService.speak(
        textToRead,
        () => {
          setIsReadingCaption(true);
          setIsSpeaking(true);
        },
        () => {
          setIsReadingCaption(false);
          setIsSpeaking(false);
          setSpeakingText('');
        },
        () => {
          setIsReadingCaption(false);
          setIsSpeaking(false);
          setSpeakingText('');
        }
      );
    }
  };

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  // Bionic Reading Render Fonksiyonu (DEHB Odaklanma Desteği)
  const renderBionicText = (text) => {
    if (!bionicReadingEnabled) return text;
    const words = text.split(' ');
    return words.map((word, idx) => {
      const mid = Math.ceil(word.length / 2);
      const boldPart = word.slice(0, mid);
      const restPart = word.slice(mid);
      return (
        <Text key={idx}>
          <Text style={{ fontWeight: '800' }}>{boldPart}</Text>
          <Text>{restPart} </Text>
        </Text>
      );
    });
  };

  const isHighContrast = theme.isHighContrast;
  const isHearing = currentMode === MODES.HEARING;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: isHearing && isPlayingVideo ? '#38BDF8' : colors.cardBorder,
          borderWidth: isHighContrast ? 2 : isHearing && isPlayingVideo ? 2.5 : 1,
        },
      ]}
      accessible={true}
      accessibilityRole="article"
      accessibilityLabel={`${post.author.name} tarafından paylaşılan gönderi. İçerik: ${post.content}`}
    >
      {/* Gönderi Sahibi */}
      <View style={styles.authorRow}>
        <Image
          source={{ uri: post.author.avatar }}
          style={[
            styles.avatar,
            {
              borderColor: isHighContrast ? '#FFE600' : colors.border,
              borderWidth: isHighContrast ? 2 : 1,
            },
          ]}
          accessible={true}
          accessibilityLabel={`${post.author.name} profil fotoğrafı`}
        />
        <View style={styles.authorInfo}>
          <Text
            style={[
              styles.authorName,
              {
                color: colors.text,
                fontSize: 16 * fontSizeScale,
              },
            ]}
          >
            {post.author.name}
          </Text>
          <Text
            style={[
              styles.authorHandle,
              {
                color: colors.textMuted,
                fontSize: 12 * fontSizeScale,
              },
            ]}
          >
            {post.author.handle} • {post.timestamp}
          </Text>
        </View>

        {/* İşitme Engelli Rozeti */}
        {isHearing && (
          <View style={styles.hearingBadge}>
            <Text style={styles.hearingBadgeText}>🧏 Görsel Destek Aktif</Text>
          </View>
        )}
      </View>

      {/* Gönderi Metni (Bionic Reading desteği ile) */}
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
        {renderBionicText(post.content)}
      </Text>

      {/* 1. Görsel ve Yapay Zekâ Sesli Açıklama Bileşeni */}
      {post.image && (
        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: post.image }}
            style={styles.postImage}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel={`Gönderi görseli. Açıklama: ${post.aiDescription}`}
          />

          {/* AI Görsel Açıklama Kutusu */}
          <View
            style={[
              styles.aiDescriptionBox,
              {
                backgroundColor: isHighContrast ? '#000000' : colors.inputBg,
                borderColor: isHighContrast ? '#FFE600' : colors.border,
                borderWidth: isHighContrast ? 2 : 1,
              },
            ]}
          >
            <View style={styles.aiHeaderRow}>
              <View style={styles.aiLabelBadge}>
                <Sparkles size={14} color={isHighContrast ? '#FFE600' : '#2563EB'} />
                <Text
                  style={[
                    styles.aiLabelText,
                    { color: isHighContrast ? '#FFE600' : '#2563EB' },
                  ]}
                >
                  Yapay Zekâ Türkçe Görsel Betimlemesi
                </Text>
              </View>

              {/* Canlı Sesli Dinle Butonu (TTS) */}
              <TouchableOpacity
                onPress={handleToggleSpeakCaption}
                style={[
                  styles.speakButton,
                  {
                    backgroundColor: isReadingCaption
                      ? '#DC2626'
                      : isHighContrast
                      ? '#FFE600'
                      : colors.primary,
                  },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={
                  isReadingCaption
                    ? 'Sesli okumayı durdur'
                    : 'Görselin yapay zekâ açıklamasını Türkçe sesli dinle'
                }
              >
                {isReadingCaption ? (
                  <VolumeX size={16} color={isHighContrast ? '#000000' : '#FFFFFF'} />
                ) : (
                  <Volume2 size={16} color={isHighContrast ? '#000000' : '#FFFFFF'} />
                )}
                <Text
                  style={[
                    styles.speakButtonText,
                    { color: isHighContrast ? '#000000' : '#FFFFFF' },
                  ]}
                >
                  {isReadingCaption ? 'Durdur' : 'Sesli Dinle'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Ses Dalga Göstergesi */}
            {isReadingCaption && (
              <View style={styles.waveRow}>
                <Activity size={16} color="#DC2626" />
                <Text style={styles.waveText}>SESLENDİRİLİYOR (Web Speech TTS)...</Text>
              </View>
            )}

            <Text
              style={[
                styles.aiDescriptionText,
                {
                  color: isHighContrast ? '#FFFFFF' : colors.text,
                  fontSize: 13 * fontSizeScale,
                },
              ]}
            >
              {renderBionicText(post.aiDescription)}
            </Text>
          </View>
        </View>
      )}

      {/* 2. Video ve Otomatik Canlı Altyazı Bileşeni */}
      {post.videoUrl && (
        <View style={styles.mediaContainer}>
          <View style={styles.videoPlaceholder}>
            <Image source={{ uri: post.videoPoster }} style={styles.postImage} />
            <TouchableOpacity
              onPress={() => setIsPlayingVideo(!isPlayingVideo)}
              style={[
                styles.playOverlay,
                { backgroundColor: isHighContrast ? '#FFE600' : '#2563EB' },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={isPlayingVideo ? 'Videoyu duraklat' : 'Videoyu oynat ve canlı altyazıyı başlat'}
            >
              {isPlayingVideo ? (
                <Pause size={28} color={isHighContrast ? '#000000' : '#FFFFFF'} />
              ) : (
                <Play size={28} color={isHighContrast ? '#000000' : '#FFFFFF'} />
              )}
            </TouchableOpacity>
          </View>

          {/* Canlı Altyazı Kutusu */}
          <View
            style={[
              styles.captionOverlay,
              {
                backgroundColor: isHighContrast ? '#000000' : 'rgba(15, 23, 42, 0.95)',
                borderColor: '#FFE600',
                borderWidth: isHighContrast || isHearing ? 2 : 0,
              },
            ]}
            accessible={true}
            accessibilityLiveRegion="polite"
            accessibilityLabel={`Canlı Altyazı: ${post.captions[currentCaptionIndex].text}`}
          >
            <View style={styles.captionBadgeRow}>
              <Subtitles size={14} color="#FFE600" />
              <Text style={styles.captionBadgeText}>Otomatik Türkçe ASR Altyazı</Text>
              {isPlayingVideo && <Text style={styles.liveDot}>● CANLI YAYIN</Text>}
            </View>
            <Text style={styles.captionText}>
              {post.captions[currentCaptionIndex].text}
            </Text>
          </View>
        </View>
      )}

      {/* Etkileşim Butonları */}
      <View
        style={[
          styles.actionRow,
          {
            borderTopColor: colors.border,
            borderTopWidth: isHighContrast ? 2 : 1,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleLike}
          style={styles.actionButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Beğen. Şu anda ${likeCount} beğeni.`}
        >
          <Heart
            size={20}
            color={liked ? '#EF4444' : isHighContrast ? '#FFE600' : colors.textMuted}
            fill={liked ? '#EF4444' : 'none'}
          />
          <Text
            style={[
              styles.actionCount,
              {
                color: liked ? '#EF4444' : colors.text,
                fontSize: 14 * fontSizeScale,
              },
            ]}
          >
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Yorum yap. Şu anda ${post.comments} yorum var.`}
        >
          <MessageCircle
            size={20}
            color={isHighContrast ? '#FFE600' : colors.textMuted}
          />
          <Text
            style={[
              styles.actionCount,
              { color: colors.text, fontSize: 14 * fontSizeScale },
            ]}
          >
            {post.comments}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Bu gönderiyi paylaş"
        >
          <Share2
            size={20}
            color={isHighContrast ? '#FFE600' : colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
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
  hearingBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hearingBadgeText: {
    color: '#0284C7',
    fontSize: 10,
    fontWeight: '800',
  },
  postText: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  mediaContainer: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  aiDescriptionBox: {
    margin: 12,
    padding: 12,
    borderRadius: 10,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiLabelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiLabelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minHeight: 36,
  },
  speakButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    paddingVertical: 2,
  },
  waveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  aiDescriptionText: {
    lineHeight: 18,
    fontWeight: '500',
  },
  videoPlaceholder: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  captionOverlay: {
    padding: 12,
    margin: 12,
    borderRadius: 8,
  },
  captionBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  captionBadgeText: {
    color: '#FFE600',
    fontSize: 11,
    fontWeight: '700',
  },
  liveDot: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 'auto',
  },
  captionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 44,
    minHeight: 44,
  },
  actionCount: {
    fontWeight: '600',
  },
});
