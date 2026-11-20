import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import {
    X, Share2, Download, Copy, Check, Sparkles,
    Send, Swords, Trophy, ExternalLink, Loader2
} from 'lucide-react';
import {
    generateBattleCardImage,
    downloadBattleCard,
    shareBattleImage,
    getBattleSocialShareLinks
} from '../utils/battleShareImage';
import { feedback } from '../utils/haptics';

const ShareBattleModal = ({ isOpen, onClose, phoneA, phoneB, scoresA, scoresB, verdict }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [generating, setGenerating] = useState(true);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [sharingNative, setSharingNative] = useState(false);

    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/#battle?a=${phoneA?.id}&b=${phoneB?.id}`
        : '';

    useEffect(() => {
        if (!isOpen || !phoneA || !phoneB) return;

        let isMounted = true;
        setGenerating(true);

        generateBattleCardImage(phoneA, phoneB, scoresA, scoresB, verdict)
            .then(canvas => {
                if (isMounted && canvas) {
                    setPreviewUrl(canvas.toDataURL('image/png'));
                }
            })
            .catch(err => {
                console.error('Failed to generate battle card image:', err);
            })
            .finally(() => {
                if (isMounted) setGenerating(false);
            });

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            isMounted = false;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, phoneA, phoneB, scoresA, scoresB, verdict, onClose]);

    if (!isOpen || !phoneA || !phoneB) return null;

    const socialLinks = getBattleSocialShareLinks(phoneA, phoneB, verdict, shareUrl);

    const handleCopy = async () => {
        try {
            feedback.shareSuccess?.();
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        } catch {
            // fallback
        }
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);
            feedback.buttonClick?.();
            await downloadBattleCard(phoneA, phoneB, scoresA, scoresB, verdict);
        } catch (err) {
            console.error('Download error:', err);
        } finally {
            setDownloading(false);
        }
    };

    const handleNativeShare = async () => {
        try {
            setSharingNative(true);
            feedback.shareSuccess?.();
            await shareBattleImage(phoneA, phoneB, scoresA, scoresB, verdict, shareUrl);
        } catch (err) {
            console.error('Share error:', err);
        } finally {
            setSharingNative(false);
        }
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
                {/* Backdrop */}
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/85 backdrop-blur-md"
                />

                {/* Dialog Container */}
                <m.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(0,0,0,0.85)] z-10 overflow-hidden max-h-[92vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white shadow-md">
                                <Swords size={18} />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5 leading-none">
                                    Share Battle Card
                                    <Sparkles size={14} className="text-amber-400" />
                                </h3>
                                <p className="text-[11px] text-gray-400 mt-1">High-res showdown graphic optimized for stories &amp; posts</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="overflow-y-auto space-y-4 pr-1">
                        {/* Live Canvas Preview */}
                        <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 aspect-[16/9] flex items-center justify-center shadow-inner">
                            {generating ? (
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                    <Loader2 size={24} className="animate-spin text-red-500" />
                                    <span className="text-xs font-semibold">Generating HD Battle Card...</span>
                                </div>
                            ) : previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt={`${phoneA?.name} vs ${phoneB?.name} Battle Card`}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <span className="text-xs text-red-400">Failed to render card preview</span>
                            )}
                        </div>

                        {/* Action Buttons: Download & Native Share */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={generating || downloading}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff1f3d] to-[#e60023] hover:from-[#ff3856] hover:to-[#ff1030] text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(255,31,61,0.35)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                            >
                                <Download size={15} />
                                <span>{downloading ? 'Saving Image...' : 'Download HD Card (PNG)'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleNativeShare}
                                disabled={generating || sharingNative}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                            >
                                <Share2 size={15} />
                                <span>{sharingNative ? 'Sharing...' : 'Share to Instagram / Apps'}</span>
                            </button>
                        </div>

                        {/* Direct Social Links */}
                        <div className="pt-2 border-t border-white/10">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                                Instant Social Share
                            </span>
                            <div className="grid grid-cols-4 gap-2">
                                <a
                                    href={socialLinks.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/[0.03] hover:bg-[#25D366]/20 border border-white/10 hover:border-[#25D366]/50 text-gray-300 hover:text-[#25D366] transition-all group"
                                >
                                    <Send size={15} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold mt-1">WhatsApp</span>
                                </a>

                                <a
                                    href={socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all group"
                                >
                                    <span className="font-black text-sm leading-none">𝕏</span>
                                    <span className="text-[10px] font-bold mt-1">Post</span>
                                </a>

                                <a
                                    href={socialLinks.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/[0.03] hover:bg-[#229ED9]/20 border border-white/10 hover:border-[#229ED9]/50 text-gray-300 hover:text-[#229ED9] transition-all group"
                                >
                                    <Send size={15} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold mt-1">Telegram</span>
                                </a>

                                <a
                                    href={socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/[0.03] hover:bg-[#0077b5]/20 border border-white/10 hover:border-[#0077b5]/50 text-gray-300 hover:text-[#0077b5] transition-all group"
                                >
                                    <ExternalLink size={15} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold mt-1">LinkedIn</span>
                                </a>
                            </div>
                        </div>

                        {/* Copy Showdown URL Bar */}
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="bg-transparent border-none outline-none text-xs text-gray-400 px-2 flex-1 font-mono truncate select-all"
                            />
                            <button
                                type="button"
                                onClick={handleCopy}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    copied
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                            >
                                {copied ? <Check size={13} /> : <Copy size={13} />}
                                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                            </button>
                        </div>
                    </div>
                </m.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default ShareBattleModal;
