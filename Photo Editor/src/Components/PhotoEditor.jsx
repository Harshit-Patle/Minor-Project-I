import { useState } from 'react';
import {
    Sliders,
    SunMedium,
    ContrastIcon,
    Droplets,
    RotateCcw,
    Image as ImageIcon,
    Download
} from 'lucide-react';

const PhotoEditor = () => {
    const [image, setImage] = useState(null);
    const [filters, setFilters] = useState({
        brightness: 100,
        contrast: 100,
        saturation: 100
    });

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
            saturation: 100
        });
    };

    const updateFilter = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: parseInt(value)
        }));
    };

    const downloadImage = () => {
        const canvas = document.createElement('canvas');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const link = document.createElement('a');
            link.download = 'edited-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };

        img.src = image;
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg">
            <div className="flex items-center gap-2 p-4 border-b">
                <Sliders className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Photo Editor</h2>
            </div>

            <div className="flex">
                {/* Left Side - Image Area */}
                <div className="flex-1 p-6 border-r min-h-[600px] flex items-center justify-center">
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
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src={image}
                                alt="Uploaded preview"
                                className="max-w-full max-h-full rounded-xl shadow-md object-contain"
                                style={{
                                    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Right Side - Controls */}
                <div className="w-80 p-6 bg-gray-50">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <SunMedium className="w-4 h-4 text-blue-500" />
                                    Brightness
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={filters.brightness}
                                        onChange={(e) => updateFilter('brightness', e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <span className="w-12 text-right text-sm text-gray-600">{filters.brightness}%</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <ContrastIcon className="w-4 h-4 text-blue-500" />
                                    Contrast
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={filters.contrast}
                                        onChange={(e) => updateFilter('contrast', e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <span className="w-12 text-right text-sm text-gray-600">{filters.contrast}%</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Droplets className="w-4 h-4 text-blue-500" />
                                    Saturation
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={filters.saturation}
                                        onChange={(e) => updateFilter('saturation', e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <span className="w-12 text-right text-sm text-gray-600">{filters.saturation}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t">
                            <button
                                onClick={resetFilters}
                                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset Filters
                            </button>

                            <button
                                onClick={downloadImage}
                                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <Download className="w-4 h-4" />
                                Download Image
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoEditor;