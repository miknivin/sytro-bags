import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [false, "Please enter your name"],
        maxlength: [50, "Your name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        sparse: true,
        validate: {
            validator: function (value) {
                return !this.phone || !!value; // Only validate email if phone is not provided
            },
            message: "Email or phone is required",
        },
    },
    phone: {
        type: String,
        sparse: true,
        validate: {
            validator: function (value) {
                return !this.email || !!value; // Only validate phone if email is not provided
            },
            message: "Email or phone is required",
        },
    },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to update existing enquiry if email or phone matches
enquirySchema.pre("save", async function (next) {
    try {
        // Only run for new documents
        if (this.isNew) {
            const query =
                this.email && this.phone
                    ? { $or: [{ email: this.email }, { phone: this.phone }] }
                    : this.email
                        ? { email: this.email }
                        : { phone: this.phone };

            const existingEnquiry = await mongoose.models.Enquiry.findOne(query);

            if (existingEnquiry) {
                // Update existing enquiry
                existingEnquiry.name = this.name;
                existingEnquiry.email = this.email || existingEnquiry.email;
                existingEnquiry.phone = this.phone || existingEnquiry.phone;
                existingEnquiry.message = this.message;
                existingEnquiry.createdAt = new Date(); // Update timestamp
                await existingEnquiry.save();

                // Throw an error to prevent saving a new document
                const error = new Error(
                    "Enquiry updated instead of creating a new one"
                );
                error.isUpdate = true; // Custom flag to handle in API
                return next(error);
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Enquiry =
    mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);

export default Enquiry;
