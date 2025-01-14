import { useState, useRef, useCallback } from 'react';


import {
    Sliders,
    SunMedium,
    ContrastIcon,
    Droplets,
    RotateCcw,
    Image as ImageIcon,
    Download,
    RotateCw,
    FlipHorizontal,
    FlipVertical,
    EyeOff,
    Layers,
    Crop,
    Sparkles,
    Palette,
    ZoomIn,
    ChevronUp,
    ChevronDown,
    Github,
    Instagram,
    Youtube,
    Send,
    Linkedin
} from 'lucide-react';
import Footer from './Footer';

const PhotoEditor = () => {
    const [image, setImage] = useState(null);
    const [isControlsOpen, setIsControlsOpen] = useState(true);
    const [filters, setFilters] = useState({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        rotation: 0,
        flipX: 1,
        flipY: 1,
        grayscale: 0,
        blur: 0,
        sepia: 0,
        opacity: 100,
        scale: 100
    });
    const [showOriginal, setShowOriginal] = useState(false);
    const [activeTab, setActiveTab] = useState('adjust');
    const [isPressed, setIsPressed] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetFilters = () => {
        setFilters({
            brightness: 100,
            contrast: 100,
            saturation: 100,
            rotation: 0,
            flipX: 1,
            flipY: 1,
            grayscale: 0,
            blur: 0,
            sepia: 0,
            opacity: 100,
            scale: 100
        });
    };

    const updateFilter = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: typeof value === 'number' ? value : parseInt(value)
        }));
    };

    const rotate = (direction) => {
        setFilters(prev => ({
            ...prev,
            rotation: (prev.rotation + (direction === 'right' ? 90 : -90)) % 360
        }));
    };

    const flip = (axis) => {
        setFilters(prev => ({
            ...prev,
            [axis]: prev[axis] * -1
        }));
    };

    const downloadImage = () => {
        const canvas = document.createElement('canvas');
        const img = new Image();

        img.onload = () => {
            const rotatedSize = Math.abs(filters.rotation) % 180 === 90
                ? { width: img.height, height: img.width }
                : { width: img.width, height: img.height };

            canvas.width = rotatedSize.width;
            canvas.height = rotatedSize.height;
            const ctx = canvas.getContext('2d');

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((filters.rotation * Math.PI) / 180);
            ctx.scale(filters.flipX * filters.scale / 100, filters.flipY * filters.scale / 100);

            ctx.filter = `brightness(${filters.brightness}%) 
                         contrast(${filters.contrast}%) 
                         saturate(${filters.saturation}%)
                         grayscale(${filters.grayscale}%)
                         blur(${filters.blur}px)
                         sepia(${filters.sepia}%)
                         opacity(${filters.opacity}%)`;

            ctx.drawImage(
                img,
                -img.width / 2,
                -img.height / 2,
                img.width,
                img.height
            );

            const link = document.createElement('a');
            link.download = 'edited-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };

        img.src = image;
    };

    const getImageStyle = () => ({
        filter: `brightness(${filters.brightness}%) 
                contrast(${filters.contrast}%) 
                saturate(${filters.saturation}%)
                grayscale(${filters.grayscale}%)
                blur(${filters.blur}px)
                sepia(${filters.sepia}%)
                opacity(${filters.opacity}%)`,
        transform: `rotate(${filters.rotation}deg) 
                   scale(${filters.flipX * filters.scale / 100}, ${filters.flipY * filters.scale / 100})`,
        transition: 'filter 0.3s ease, transform 0.3s ease'
    });

    const TabButton = ({ icon: Icon, label, tabName }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center
                ${activeTab === tabName
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'}`}
        >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">{label}</span>
        </button>
    );

    const renderControls = () => {
        switch (activeTab) {
            case 'adjust':
                return (
                    <div className="space-y-4">
                        <FilterSlider
                            icon={SunMedium}
                            label="Brightness"
                            value={filters.brightness}
                            onChange={(v) => updateFilter('brightness', v)}
                            min="0"
                            max="200"
                        />
                        <FilterSlider
                            icon={ContrastIcon}
                            label="Contrast"
                            value={filters.contrast}
                            onChange={(v) => updateFilter('contrast', v)}
                            min="0"
                            max="200"
                        />
                        <FilterSlider
                            icon={Droplets}
                            label="Saturation"
                            value={filters.saturation}
                            onChange={(v) => updateFilter('saturation', v)}
                            min="0"
                            max="200"
                        />
                        <FilterSlider
                            icon={Layers}
                            label="Opacity"
                            value={filters.opacity}
                            onChange={(v) => updateFilter('opacity', v)}
                            min="0"
                            max="100"
                        />
                    </div>
                );
            case 'effects':
                return (
                    <div className="space-y-4">
                        <FilterSlider
                            icon={Layers}
                            label="Grayscale"
                            value={filters.grayscale}
                            onChange={(v) => updateFilter('grayscale', v)}
                            min="0"
                            max="100"
                        />
                        <FilterSlider
                            icon={Sparkles}
                            label="Blur"
                            value={filters.blur}
                            onChange={(v) => updateFilter('blur', v)}
                            min="0"
                            max="10"
                        />
                        <FilterSlider
                            icon={Palette}
                            label="Sepia"
                            value={filters.sepia}
                            onChange={(v) => updateFilter('sepia', v)}
                            min="0"
                            max="100"
                        />
                    </div>
                );
            case 'transform':
                return (
                    <div className="space-y-4">
                        <FilterSlider
                            icon={ZoomIn}
                            label="Scale"
                            value={filters.scale}
                            onChange={(v) => updateFilter('scale', v)}
                            min="50"
                            max="200"
                        />
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => rotate('left')}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                title="Rotate Left"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => rotate('right')}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                title="Rotate Right"
                            >
                                <RotateCw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => flip('flipX')}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                title="Flip Horizontal"
                            >
                                <FlipHorizontal className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => flip('flipY')}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                title="Flip Vertical"
                            >
                                <FlipVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };



    const FilterSlider = ({ icon: Icon, label, value, onChange, min, max }) => (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Icon className="w-4 h-4 text-blue-500" />
                {label}
            </label>
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="w-12 text-right text-sm text-gray-600">{value}%</span>
            </div>
        </div>
    );

    const ShowOriginalButton = () => {
        const handlePressStart = (e) => {
            e.preventDefault(); // Prevent default to avoid unwanted behavior
            setIsPressed(true);
            setShowOriginal(true);
        };

        const handlePressEnd = (e) => {
            e.preventDefault(); // Prevent default to avoid unwanted behavior
            setIsPressed(false);
            setShowOriginal(false);
        };

        const handlePressCancel = (e) => {
            e.preventDefault(); // Prevent default to avoid unwanted behavior
            if (isPressed) {
                setIsPressed(false);
                setShowOriginal(false);
            }
        };

        return (
            <button
                className={`absolute top-4 right-4 p-3 sm:p-2 bg-white rounded-lg shadow-md 
                    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 
                    touch-manipulation select-none
                    ${isPressed ? 'bg-gray-100' : ''}`}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                onTouchCancel={handlePressCancel}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressCancel}
                aria-label="Show original image"
            >
                <EyeOff className="w-6 h-6 sm:w-5 sm:h-5 text-gray-600" />
            </button>
        );
    };

    return (
        <div className="w-full bg-white">
            {/* Header */}
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2 ">
                        <Sliders className="w-5 h-5 text-blue-500" />
                        <h2 className="text-xl font-semibold text-gray-800">Photo Editor</h2>
                    </div>
                    <button
                        onClick={() => setIsControlsOpen(!isControlsOpen)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                        {isControlsOpen ? (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                        ) : (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full min-h-screen bg-gray-50">
                <div className="flex flex-col md:flex-row max-w-[120rem] mx-auto">
                    {/* Image Area */}
                    <div className="flex-1 p-4 md:p-6 min-h-[300px] md:min-h-[calc(100vh-88px)] bg-white">
                        {!image ? (
                            <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                <div className="flex flex-col items-center justify-center p-6 text-center">
                                    <ImageIcon className="w-12 h-12 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400">PNG, JPG or GIF</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                                <img
                                    src={image}
                                    alt="Uploaded preview"
                                    className="max-w-full max-h-[calc(100vh-200px)] object-contain"
                                    style={showOriginal ? {} : getImageStyle()}
                                />
                                <ShowOriginalButton />
                            </div>
                        )}
                    </div>

                    {/* Controls Panel */}
                    <div className={`${isControlsOpen ? 'block' : 'hidden'} md:block w-full md:w-96 p-4 md:p-6 bg-gray-100 md:min-h-[calc(100vh-88px)] md:border-l`}>
                        <div className="space-y-6 sticky top-6">
                            {/* Tabs */}
                            <div className="flex justify-evenly pb-4 border-b">
                                <TabButton icon={Sliders} label="Adjust" tabName="adjust" />
                                <TabButton icon={Sparkles} label="Effects" tabName="effects" />
                                <TabButton icon={Crop} label="Transform" tabName="transform" />
                            </div>

                            {/* Controls */}
                            {renderControls()}

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-6 border-t">
                                <button
                                    onClick={resetFilters}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Reset All
                                </button>

                                <button
                                    onClick={downloadImage}
                                    disabled={!image}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Image
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PhotoEditor;