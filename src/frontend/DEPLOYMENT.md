# Deployment Guide

This guide covers deploying a fresh instance of the Image Gallery application to the Internet Computer.

## Prerequisites

- [DFX CLI](https://internetcomputer.org/docs/current/developer-docs/setup/install/) installed
- Node.js and pnpm installed
- Internet Computer wallet with cycles (for mainnet deployment)

## Local Development Deployment

1. **Start the local replica:**
   ```bash
   dfx start --clean --background
   ```

2. **Deploy the backend canister:**
   ```bash
   dfx deploy backend
   ```

3. **Generate TypeScript bindings:**
   ```bash
   dfx generate backend
   ```

4. **Install frontend dependencies:**
   ```bash
   cd frontend
   pnpm install
   ```

5. **Start the development server:**
   ```bash
   pnpm start
   ```

6. **Access the application:**
   Open your browser to `http://localhost:3000`

## Mainnet Deployment

1. **Set the network to IC mainnet:**
   ```bash
   dfx identity use default  # or your preferred identity
   ```

2. **Deploy to mainnet:**
   ```bash
   dfx deploy --network ic
   ```

3. **Note the canister IDs:**
   After deployment, DFX will output the canister IDs. Save these for configuration.

4. **Build the frontend for production:**
   ```bash
   cd frontend
   VITE_DFX_NETWORK=ic VITE_BACKEND_CANISTER_ID=<your-backend-canister-id> pnpm build
   ```

5. **Deploy the frontend assets:**
   The frontend is automatically deployed as part of the `dfx deploy` command.

## Configuration

### Environment Variables

The frontend uses the following environment variables:

- `VITE_BACKEND_CANISTER_ID`: The canister ID of your backend
- `VITE_DFX_NETWORK`: The network (`local` or `ic`)

These are automatically set by DFX during deployment, but you can override them if needed.

### Runtime Configuration

The application uses `frontend/src/config/runtime.ts` to determine the backend connection:

- **Development**: Connects to `http://localhost:4943`
- **Production (IC mainnet)**: Connects to `https://ic0.app`
- **Custom domain**: Automatically derives the host from the current origin

## Post-Deployment Verification

After deploying, verify the following functionality:

### 1. Upload Test
- Navigate to the application
- Upload a test image (JPEG, PNG, GIF, or WebP, max 5MB)
- Verify the image appears in the gallery without requiring a page refresh

### 2. List Test
- Refresh the page
- Verify all uploaded images are displayed in the gallery
- Check that image metadata (filename, size, date) is correct

### 3. Download Test
- Hover over an image in the gallery
- Click the download button
- Verify the correct image file is downloaded

### 4. Delete Test
- Hover over an image in the gallery
- Click the delete button
- Confirm the deletion in the dialog
- Verify the image is removed from the gallery
- Refresh the page and verify the image does not reappear

## Troubleshooting

### "Backend connection not initialized" Error

This usually means the canister ID is not properly configured. Check:

1. The `VITE_BACKEND_CANISTER_ID` environment variable is set
2. The canister is deployed and running
3. The network configuration matches your deployment

### Images Not Loading

If images fail to load:

1. Check browser console for errors
2. Verify the backend canister is responding: `dfx canister call backend listBlobs`
3. Ensure the frontend is using the correct canister ID

### Upload Failures

If uploads fail:

1. Verify file size is under 5MB
2. Check file type is supported (JPEG, PNG, GIF, WebP)
3. Ensure the backend canister has sufficient cycles

## Upgrading an Existing Deployment

To upgrade an existing deployment with new code:

1. **Deploy the new backend:**
   ```bash
   dfx deploy backend --network ic
   ```

2. **Rebuild and deploy the frontend:**
   ```bash
   cd frontend
   pnpm build
   dfx deploy frontend --network ic
   ```

3. **Clear browser cache:**
   Users may need to hard-refresh (Ctrl+Shift+R or Cmd+Shift+R) to load the new frontend.

## Custom Domain Setup

See [CUSTOM_DOMAIN.md](./CUSTOM_DOMAIN.md) for detailed instructions on connecting a custom domain to your deployment.
