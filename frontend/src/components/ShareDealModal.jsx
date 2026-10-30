import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import {
    X, Share2, Download, Copy, Check, Sparkles,
    Send, Smartphone, ArrowRight, ExternalLink
} from 'lucide-react';
import {
    generateDealCardImage,
    downloadDealCard,
    shareDealImage,
    getSocialShareLinks
} from '../utils/dealShareImage';
import { getShareablePhoneUrl, copyPhoneShareLink } from '../utils/deepLink';
import { resolveProductImage } from '../utils/imageResolver';
import { feedback } from '../utils/haptics';

const ShareDealModal = ({ product, onClose }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [generating, setGenerating] = useState(true);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [sharingNative, setSharingNative] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        if (!product) return;
        const url = getShareablePhoneUrl(product);
        setShareUrl(url);

        let isMounted = true;
        setGenerating(true);

        const imgSrc = resolveProductImage(product.image, product.name);
        generateDealCardImage(product, { imageSrc: imgSrc })
            .then(canvas => {
                if (isMounted && canvas) {
                    setPreviewUrl(canvas.toDataURL('image/png'));
                }
            })
            .catch(err => {
                console.error('Failed to generate deal card image:', err);
            })
            .finally(() => {
                if (isMounted) setGenerating(false);
            });

        // Close on ESC
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            isMounted = false;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [product, onClose]);

    if (!product) return null;

    const socialLinks = getSocialShareLinks(product, shareUrl);

    const handleCopy = async () => {
        feedback.shareSuccess?.();
        const res = await copyPhoneShareLink(product);
        if (res.success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        }
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);
            feedback.buttonClick?.();
            await downloadDealCard(product);
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
            await shareDealImage(product, shareUrl);
        } catch (err) {
            console.error('Share error:', err);
        } finally {
            setSharingNative(false);
        }
    };

    const price = Number(product.price || 0);

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
                {/* Backdrop */}
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Modal Container */}
                <m.div
                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 15 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-2xl bg-[#0a0a10] border border-red-500/35 rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(255,20,50,0.3)] z-10 my-auto text-white overflow-hidden max-h-[92vh] flex flex-col"
                >
                    {/* Ambient corner glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] relative z-10 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,20,50,0.4)]">
                                <Share2 size={16} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                                    Share Deal Card
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full">
                                        Viral
                                    </span>
                                </h3>
                                <p className="text-xs text-gray-400">
                                    Generate & share live smartphone deal with full specs
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Content Scrollable Area */}
                    <div className="overflow-y-auto pr-1 py-3 space-y-4 relative z-10 custom-scrollbar">
                        {/* Live Canvas Image Preview */}
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#06060a] shadow-inner group">
                            {generating ? (
                                <div className="h-56 sm:h-72 flex flex-col items-center justify-center gap-3">
                                    <div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                                        <Sparkles size={13} className="text-red-400 animate-pulse" />
                                        Rendering High-Res Deal Card...
                                    </span>
                                </div>
                            ) : previewUrl ? (
                                <div className="relative">
                                    <img
                                        src={previewUrl}
                                        alt={`${product.name} deal card`}
                                        className="w-full h-auto object-contain rounded-2xl block"
                                    />
                                    <div className="absolute bottom-2.5 right-2.5 hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] text-gray-300">
                                        <Sparkles size={11} className="text-red-400" />
                                        <span>1200 × 630 HD Banner</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-48 flex items-center justify-center text-xs text-gray-400">
                                    Preview unavailable
                                </div>
                            )}
                        </div>

                        {/* Quick Action Buttons Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {/* Download PNG Button */}
                            <m.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleDownload}
                                disabled={downloading || generating}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(255,20,50,0.35)] transition-all disabled:opacity-50"
                            >
                                <Download size={15} />
                                <span>{downloading ? 'Downloading...' : 'Download HD Deal Card'}</span>
                            </m.button>

                            {/* Native / System Share */}
                            <m.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleNativeShare}
                                disabled={sharingNative || generating}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 text-white font-bold text-xs sm:text-sm hover:border-red-500/40 transition-all disabled:opacity-50"
                            >
                                <Share2 size={15} className="text-red-400" />
                                <span>{sharingNative ? 'Opening...' : 'Share Card & Deal'}</span>
                            </m.button>
                        </div>

                        {/* 1-Click Social Channels Row */}
                        <div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                                Instant 1-Click Share
                            </span>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {/* WhatsApp */}
                                <a
                                    href={socialLinks.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 hover:border-[#25D366]/60 text-green-400 transition-all group"
                                >
                                    <span className="text-base sm:text-lg mb-0.5">💬</span>
                                    <span className="text-[10px] font-bold text-gray-200 group-hover:text-green-300">WhatsApp</span>
                                </a>

                                {/* Twitter / X */}
                                <a
                                    href={socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 hover:border-white/40 text-gray-200 transition-all group"
                                >
                                    <span className="text-base sm:text-lg mb-0.5 font-bold">𝕏</span>
                                    <span className="text-[10px] font-bold text-gray-200 group-hover:text-white">Post on X</span>
                                </a>

                                {/* Telegram */}
                                <a
                                    href={socialLinks.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/30 hover:border-[#0088cc]/60 text-sky-400 transition-all group"
                                >
                                    <Send size={16} className="mb-1 text-[#0088cc] group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold text-gray-200 group-hover:text-sky-300">Telegram</span>
                                </a>

                                {/* Facebook */}
                                <a
                                    href={socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 hover:border-[#1877F2]/60 text-blue-400 transition-all group"
                                >
                                    <span className="text-base sm:text-lg mb-0.5 font-bold">f</span>
                                    <span className="text-[10px] font-bold text-gray-200 group-hover:text-blue-300">Facebook</span>
                                </a>

                                {/* LinkedIn */}
                                <a
                                    href={socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 hover:border-[#0A66C2]/60 text-blue-300 transition-all group"
                                >
                                    <span className="text-base sm:text-lg mb-0.5 font-bold">in</span>
                                    <span className="text-[10px] font-bold text-gray-200 group-hover:text-blue-200">LinkedIn</span>
                                </a>
                            </div>
                        </div>

                        {/* Copy Deep Link Input */}
                        <div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                                Direct Product Link
                            </span>
                            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/60 border border-white/10">
                                <input
                                    type="text"
                                    readOnly
                                    value={shareUrl}
                                    className="flex-1 bg-transparent px-2.5 text-xs text-gray-300 outline-none truncate font-mono select-all"
                                />
                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        copied
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                    }`}
                                >
                                    {copied ? (
                                        <>
                                            <Check size={13} className="stroke-[3]" />
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={13} />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-gray-400 shrink-0">
                        <span>Includes live Amazon & Flipkart prices</span>
                        <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                            <Sparkles size={12} />
                            <span>Powered by TechBoy Store</span>
                        </div>
                    </div>
                </m.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default ShareDealModal;
