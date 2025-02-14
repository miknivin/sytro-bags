import mongoose from "mongoose";
import User from "./User";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter bag name"],
        maxLength: [200, "Bag name cannot exceed 200 characters"]
    },
    actualPrice: {
        type: Number,
        required: [true, "Please enter bag actual price"],
    },
    offer: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
        required: [true, "Please enter bag description"],
        maxLength: [5000, "Description cannot exceed 5000 characters"]
    },
    ratings: {
        type: Number,
        default: 4
    },
    images: [
        {
            public_id: {
                type: String,
                required: false
            },
            url: {
                type: String,
                required: false
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter bag category"],
        enum: {
            values: [
                "Kids Bags",
                "Casual Bags",
                "Travel Bags"
            ],
            message: "Please select correct category",
        },
    },
    specifications: {
        material: {
            type: String,
            required: false,
            enum: {
                values: [
                    "Leather",
                    "Canvas",
                    "Nylon",
                    "Polyester",
                    "Cotton",
                    "Synthetic"
                ],
                message: "Please select valid material",
            }
        },
        dimensions: {
            length: { type: Number, required: false },
            width: { type: Number, required: false },
            height: { type: Number, required: false },
            unit: { 
                type: String, 
                default: 'cm',
                enum: ['cm', 'inches']
            }
        },
        color: {
            type: String,
            required: false
        },
        weight: {
            type: Number,
            required: false
        }
    },
    features: [{
        type: String,
        enum: [
            "Adjustable Strap",
            "Multiple Compartments",
            "Water Resistant",
            "Zip Closure",
            "Side Pockets",
            "Front Pocket",
            "Cushioned Straps",
            "Laptop Compartment",
            "Bottle Holder",
            "Trolley Support"
        ]
    }],
    stock: {
        type: Number,
        required: [true, "Please enter bag stock"]
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            ratings: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

// Check if model exists before creating
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;