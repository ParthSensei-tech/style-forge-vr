# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5cd138d7-6d44-414c-872c-4faf3fe8f7e1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5cd138d7-6d44-414c-872c-4faf3fe8f7e1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- A-Frame (for VR/3D scenes)
- Supabase (backend and authentication)

## VR Try-On Feature

This project includes a VR try-on experience accessible at `/vr-tryon`. 

### Getting Started with VR Try-On

1. **Clone and run the project**:
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   npm ci
   npm run dev
   ```

2. **Navigate to VR Try-On**: Visit `http://localhost:5173/vr-tryon` in your browser

3. **Environment Setup**: Make sure you have valid Supabase environment variables configured:
   - The project uses Supabase for clothing item storage and user data
   - Items are fetched from the `items` table with image URLs from Supabase storage

### VR Usage

**Browser Requirements**:
- Chrome, Edge, or other WebXR-compatible browsers
- HTTPS connection (required for WebXR in production)

**VR Hardware Support**:
- Oculus Quest/Quest 2
- HTC Vive
- Windows Mixed Reality headsets
- Any WebXR-compatible VR device

**Controls**:
- **Mouse**: Look around the 3D scene
- **WASD**: Move around the virtual space
- **VR Mode**: Click "Enter VR" button when VR headset is connected

### Features

- **Avatar Selection**: Choose between two avatar models
- **Clothing Application**: Click clothing items to apply them as textures on the avatar
- **VR Immersion**: Full WebXR support for VR headsets
- **Outfit Saving**: Save your virtual outfits to Supabase
- **Responsive Design**: Works on desktop and mobile devices

### Local Development Tips

- **Testing VR locally**: Use `https://localhost:5173` (HTTPS required for WebXR)
- **Avatar Models**: Replace placeholder files in `/public/avatars/` with actual .glb models
- **Performance**: Keep avatar models under 5MB for optimal loading
- **Clothing Assets**: Ensure clothing items in Supabase have valid `image_url` fields

### Troubleshooting

- **White screen**: Check browser console for Supabase connection errors
- **VR not working**: Ensure HTTPS, WebXR-compatible browser, and connected VR device
- **Items not loading**: Verify Supabase configuration and item table has data
- **Performance issues**: Optimize GLB file sizes and reduce polygon count

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5cd138d7-6d44-414c-872c-4faf3fe8f7e1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
