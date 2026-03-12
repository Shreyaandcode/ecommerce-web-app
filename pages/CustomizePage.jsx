import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const INITIAL_STATE = {
    bodice: "none",
    sleeve: "none",
    skirtStyle: "none"
};

const skirtStyles = [
    { id: "circle", name: "Circle" },
    { id: "dipped-hem", name: "Dipped Hem" },
    { id: "1-2_circle", name: "1/2 Circle" },
    { id: "3-4_circle", name: "3/4 Circle" },
    { id: "fitted_aline", name: "Fitted A-Line" },
    { id: "pencil", name: "Pencil" },
    { id: "pleated", name: "Pleated" }
];

const sleeveStyles = [
    { id: "sleeveless", name: "Sleeveless" },
    { id: "elbow_bell", name: "Elbow Bell" },
    { id: "3_4_length", name: "3/4 Length" },
    { id: "full_length", name: "Full Length" },
    { id: "cap", name: "Cap" },
    { id: "elbow_fitted", name: "Elbow Fitted" },
    { id: "short_butterfly", name: "Short Butterfly" },
    { id: "short_flutter", name: "Short Flutter" },
];

const bodiceStyles = [
    { id: "classic-tiffany", name: "Classic Tiffany" },
    { id: "sweetheart", name: "Sweetheart" },
    { id: "v-neck", name: "V Neck" },
    { id: "bustier", name: "Bustier" },
    { id: "highback", name: "Highback Scoop" },
    { id: "lowback", name: "Lowback Scoop" },
    { id: "princess", name: "Princess" },
    { id: "square", name: "Square Scoop" }
];

const tabs = [
    { id: "bodice", name: "Bodice", color: "text-pink-600", icon: "👗" },
    { id: "sleeve", name: "Sleeve", color: "text-purple-600", icon: "🎀" },
    { id: "skirtStyle", name: "Skirt Style", color: "text-indigo-600", icon: "👗" },
    { id: "yourDesigns", name: "Your Designs", color: "text-amber-600", icon: "💝" },
];

const getImagePath = (type, id) => {
    if (!id || id === "none") return null;
    if (type === 'sleeve') {
        return `/images/sleeves/${id}.jpg`;
    }
    if (type === 'bodice') {
        const bodiceMap = {
            "classic-tiffany": "classic-tiffany.png",
            "sweetheart": "sweetheart.png",
            "v-neck": "v-neck.png",
            "bustier": "bustier.png",
            "highback": "highback.png",
            "lowback": "lowback.png",
            "princess": "princess.png",
            "square": "square.jpg"
        };
        return `/images/bodice/${bodiceMap[id]}`;
    }
    if (type === 'skirtStyle') {
        const skirtMap = {
            "circle": "circle.png",
            "dipped-hem": "dipped-hem.png",
            "1-2_circle": "1-2_circle.png",
            "3-4_circle": "3-4_circle.png",
            "fitted_aline": "fitted_aline.png",
            "pencil": "pencil.png",
            "pleated": "pleated.png"
        };
        if (!skirtMap[id]) return null;
        return `/images/skirts/${skirtMap[id]}`;
    }
    return null;
};

const CustomizePage = () => {
    const [customization, setCustomization] = useState(INITIAL_STATE);
    const [selectedTab, setSelectedTab] = useState("bodice");
    const [savedDesigns, setSavedDesigns] = useState(() => {
        const saved = localStorage.getItem('savedDesigns');
        return saved ? JSON.parse(saved) : [];
    });
    const [zoom, setZoom] = useState(1);
    const [renderKey, setRenderKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('currentDesign');
        if (saved) {
            setCustomization(JSON.parse(saved));
        }
        // Preload all images
        const preloadImages = async () => {
            const imagesToPreload = [
                ...bodiceStyles.map(style => getImagePath('bodice', style.id)),
                ...sleeveStyles.map(style => getImagePath('sleeve', style.id)),
                ...skirtStyles.map(style => getImagePath('skirtStyle', style.id)),
                '/images/dummy.png',
                '/images/mannequin-realistic.png'
            ].filter(Boolean);

            const preloadPromises = imagesToPreload.map(src => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = resolve;
                    img.onerror = reject;
                });
            });

            try {
                await Promise.all(preloadPromises);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to preload some images", error);
                setIsLoading(false);
            }
        };
        preloadImages();
    }, []);

    useEffect(() => {
        localStorage.setItem('currentDesign', JSON.stringify(customization));
        setRenderKey(prev => prev + 1);
    }, [customization]);

    const handleCustomizationChange = (type, value) => {
        setCustomization(prev => {
            const newState = { ...prev, [type]: value };
            return newState;
        });
    };

    const handleExtraToggle = (extraId) => {
        setCustomization(prev => ({
            ...prev,
            extras: prev.extras && prev.extras.includes(extraId)
                ? prev.extras.filter(id => id !== extraId)
                : [...(prev.extras || []), extraId]
        }));
    };

    const handleSaveDesign = () => {
        const newDesign = {
            id: Date.now(),
            name: `Design ${savedDesigns.length + 1}`,
            ...customization
        };
        const updatedDesigns = [...savedDesigns, newDesign];
        setSavedDesigns(updatedDesigns);
        localStorage.setItem('savedDesigns', JSON.stringify(updatedDesigns));
    };

    const handleLoadDesign = (design) => {
        setCustomization(design);
        setSelectedTab('bodice');
    };

    const handleReset = () => {
        setCustomization(INITIAL_STATE);
        setSelectedTab('bodice');
    };

    const calculatePrice = () => {
        let total = 0;
        total += 12000;
        return total.toLocaleString('en-IN');
    };

    const getFabricEffect = () => {
        return '';
    };

    const CustomizationSection = ({ items, type, current, isMultiSelect = false }) => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {items.map((item) => {
                const imagePath = getImagePath(type, item.id);
                const isSelected = isMultiSelect 
                    ? customization.extras && customization.extras.includes(item.id)
                    : current === item.id;

                return (
                    <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => isMultiSelect 
                            ? handleExtraToggle(item.id)
                            : handleCustomizationChange(type, item.id)
                        }
                        className={`relative p-4 rounded-xl transition-all transform ${
                            isSelected
                                ? "ring-2 ring-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
                                : "hover:bg-gradient-to-br from-gray-50 to-white shadow-md hover:shadow-lg"
                        }`}
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-full aspect-square flex items-center justify-center bg-white rounded-lg mb-3 overflow-hidden">
                                {imagePath ? (
                                    <img 
                                        src={imagePath}
                                        alt={item.name}
                                        className="w-4/5 h-4/5 object-contain transform transition-transform hover:scale-110"
                                        onError={(e) => {
                                            console.log('Image failed to load:', imagePath);
                                            e.target.onerror = null;
                                            e.target.src = "/images/placeholder.svg";
                                        }}
                                    />
                                ) : type === "color" ? (
                                    <div 
                                        className="w-16 h-16 rounded-full border border-gray-200"
                                        style={{ backgroundColor: item.value }}
                                    />
                                ) : type === "pattern" ? (
                                    <div 
                                        className="w-16 h-16 rounded-lg border border-gray-200"
                                        style={{ 
                                            backgroundImage: item.id !== "solid" ? `url(/textures/patterns/${item.id}-thumb.jpg)` : null,
                                            backgroundColor: item.id === "solid" ? "#f8f8f8" : null
                                        }}
                                    />
                                ) : (
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">{item.name}</div>
                                        {item.price && (
                                            <div className="text-lg font-bold text-green-600">
                                                ₹{item.price.toLocaleString('en-IN')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <span className="text-sm font-medium text-gray-800 whitespace-pre-line text-center">
                                {item.name}
                                {item.price && (
                                    <div className="text-green-600 font-semibold mt-1">
                                        ₹{item.price.toLocaleString('en-IN')}
                                    </div>
                                )}
                            </span>
                        </div>
                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                                ? "border-green-500 bg-gradient-to-r from-green-500 to-emerald-500"
                                : "border-gray-300 bg-white"
                        }`}>
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 rounded-full bg-white"
                                />
                            )}
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );

    const getDressPreview2D = () => {
        return (
            <div className="relative w-full h-full flex justify-center items-center bg-white rounded-xl overflow-hidden"
                style={{ aspectRatio: '1/2' }}>
                <div className="relative w-full h-full">
                    <img
                        src="/images/dummy.png"
                        alt="Mannequin"
                        className="w-full h-full object-contain"
                        style={{
                            maxWidth: '150%',
                            maxHeight: '150%',
                            objectFit: 'contain',
                            zIndex: 5
                        }}
                        draggable={true}
                    />

                    {/* Bodice Mask */}
                    {customization.bodice && customization.bodice !== "none" && (
                        <img
                            src={getImagePath('bodice', customization.bodice)}
                            alt="Bodice Mask"
                            className="absolute object-contain"
                            style={{
                                top: '30%',
                                left: '50.2%',
                                transform: 'translateX(-50%)',
                                width: '19.5%',
                                height: 'auto',
                                zIndex: 9,
                                filter: 'brightness(0) invert(1)',
                                opacity: 1,
                                pointerEvents: 'none'
                            }}
                            aria-hidden="true"
                        />
                    )}

                    {/* Skirt Mask */}
                    {customization.skirtStyle && customization.skirtStyle !== "none" && (
                        <img
                            src={getImagePath('skirtStyle', customization.skirtStyle)}
                            alt="Skirt Mask"
                            className="absolute object-contain"
                            style={{
                                top: '40%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60%',
                                height: 'auto',
                                zIndex: 8,
                                filter: 'brightness(0) invert(1)',
                                opacity: 1,
                                pointerEvents: 'none'
                            }}
                            aria-hidden="true"
                        />
                    )}

                    {/* Sleeve Mask - Right */}
                    {customization.sleeve && customization.sleeve !== "none" && (
                        <img
                            src={getImagePath('sleeve', customization.sleeve)}
                            alt="Sleeve Mask Right"
                            className="absolute object-contain"
                            style={{
                                top: '28.5%',
                                left: '63%',
                                transform: 'translateX(-50%)',
                                width: '25%',
                                height: 'auto',
                                maxHeight: '25%',
                                zIndex: 9,
                                filter: 'brightness(0) invert(1)',
                                opacity: 1,
                                pointerEvents: 'none'
                            }}
                            aria-hidden="true"
                        />
                    )}

                    {/* Sleeve Mask - Left */}
                    {customization.sleeve && customization.sleeve !== "none" && (
                        <img
                            src={getImagePath('sleeve', customization.sleeve)}
                            alt="Sleeve Mask Left"
                            className="absolute object-contain"
                            style={{
                                top: '28.5%',
                                left: '38%',
                                transform: 'translateX(-50%) scaleX(-1)',
                                width: '25%',
                                height: 'auto',
                                maxHeight: '25%',
                                zIndex: 9,
                                filter: 'brightness(0) invert(1)',
                                opacity: 1,
                                pointerEvents: 'none'
                            }}
                            aria-hidden="true"
                        />
                    )}

                    {/* Bodice Layer */}
                    {customization.bodice && customization.bodice !== "none" && (
                        <img
                            src={getImagePath('bodice', customization.bodice)}
                            alt="Bodice"
                            className="absolute object-contain"
                            style={{
                                top: '28.5%',
                                left: '50.2%',
                                transform: 'translateX(-50%)',
                                width: '20%',
                                height: 'auto',
                                zIndex: 20,
                                mixBlendMode: 'multiply',
                                opacity: 0.97,
                            }}
                            onError={e => { e.target.style.display = 'none'; }}
                        />
                    )}

                    {/* Skirt Layer */}
                    {customization.skirtStyle && customization.skirtStyle !== "none" && (
                        <img
                            src={getImagePath('skirtStyle', customization.skirtStyle)}
                            alt="Skirt"
                            className="absolute object-contain"
                            style={{
                                top: '40%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60%',
                                height: 'auto',
                                zIndex: 15,
                                mixBlendMode: 'multiply',
                                opacity: 1,
                            }}
                            onError={e => {
                                e.target.style.display = 'none';
                            }}
                        />
                    )}

                    {/* Sleeve Layer - Right */}
                    {customization.sleeve && customization.sleeve !== "none" && (
                        <img
                            src={getImagePath('sleeve', customization.sleeve)}
                            alt="Sleeve Right"
                            className="absolute object-contain"
                            style={{
                                top: '28.5%',
                                left: '62.2%',
                                transform: 'translateX(-50%)',
                                width: '25%',
                                height: 'auto',
                                maxHeight: '25%',
                                opacity: 0.9,
                                zIndex: 21,
                                mixBlendMode: 'multiply',
                            }}
                            onError={e => { e.target.style.display = 'none'; }}
                        />
                    )}

                    {/* Sleeve Layer - Left (mirrored) */}
                    {customization.sleeve && customization.sleeve !== "none" && (
                        <img
                            src={getImagePath('sleeve', customization.sleeve)}
                            alt="Sleeve Left"
                            className="absolute object-contain"
                            style={{
                                top: '28.5%',
                                left: '38%',
                                transform: 'translateX(-50%) scaleX(-1)',
                                width: '25%',
                                height: 'auto',
                                maxHeight: '25%',
                                opacity: 0.9,
                                zIndex: 21,
                                mixBlendMode: 'multiply',
                            }}
                            onError={e => { e.target.style.display = 'none'; }}
                        />
                    )}
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        switch (selectedTab) {
            case 'bodice':
                return <CustomizationSection items={bodiceStyles} type="bodice" current={customization.bodice} />;
            case 'sleeve':
                return <CustomizationSection items={sleeveStyles} type="sleeve" current={customization.sleeve} />;
            case 'skirtStyle':
                return <CustomizationSection items={skirtStyles} type="skirtStyle" current={customization.skirtStyle} />;
            case 'yourDesigns':
                return (
                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                            {savedDesigns.length > 0 ? (
                                savedDesigns.map(design => (
                                    <button
                                        key={design.id}
                                        onClick={() => handleLoadDesign(design)}
                                        className="p-4 rounded-lg border border-gray-200 hover:border-green-500 transition-colors"
                                    >
                                        <h3 className="font-medium">{design.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {design.skirtStyle} style
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-2 p-8 text-center">
                                    <p className="text-gray-500">No saved designs yet.</p>
                                    <p className="mt-2 text-sm text-gray-400">Customize your dress and click "Save Design" to store it here.</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSaveDesign}
                            className="mt-6 w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                        >
                            Save Current Design
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
            {isLoading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        <h2 className="text-xl font-medium text-gray-700">Loading dress designer...</h2>
                        <p className="mt-2 text-gray-500">Preparing your custom dress experience</p>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold text-green-700 mb-2 tracking-wide font-serif">DESIGN YOUR OWN DRESS</h1>
                        <p className="text-base text-gray-700 mb-4">Select options below to create your perfect dress</p>
                        <div className="inline-flex rounded-lg bg-gray-100 p-1">
                            <button
                                className="px-4 py-2 rounded-lg bg-green-600 text-white"
                            >
                                2D View
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Model Preview */}
                        <div className="lg:flex-1 flex flex-col items-center">
                            <div className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-lg p-4">
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    {getDressPreview2D()}
                                </div>
                                
                                {/* Zoom controls */}
                                <div className="mt-4 flex justify-center items-center">
                                    <button 
                                        onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </button>
                                    <div className="mx-4 text-gray-700 font-medium">{Math.round(zoom * 100)}%</div>
                                    <button 
                                        onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </button>
                                </div>
                                
                                {/* Price display */}
                                <div className="mt-6 text-center">
                                    <p className="text-gray-700 font-medium">Estimated Price</p>
                                    <p className="text-3xl font-bold text-green-700">₹{calculatePrice()}</p>
                                    <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                                        Request Quote
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Design Options with Tabs */}
                        <div className="lg:flex-[2]">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                {/* Main Tabs */}
                                <div className="flex flex-nowrap overflow-x-auto px-4 pt-4 bg-gray-50 gap-1">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setSelectedTab(tab.id)}
                                            className={`px-4 py-2 rounded-t-lg whitespace-nowrap font-medium transition-colors ${
                                                selectedTab === tab.id 
                                                    ? "bg-white text-green-700 border-t-2 border-l border-r border-green-500" 
                                                    : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            <span className="mr-2">{tab.icon}</span>
                                            {tab.name}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleReset}
                                        className="px-4 py-2 rounded-lg whitespace-nowrap font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors ml-auto"
                                    >
                                        <span className="mr-2">🔄</span>
                                        Reset
                                    </button>
                                </div>
                                {/* Options Grid for Selected Tab */}
                                <div className="max-h-[600px] overflow-y-auto">
                                    {renderTabContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomizePage;