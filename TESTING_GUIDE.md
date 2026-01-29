# Quick Mobile Testing Guide

## How to Test on Your Phone

### Option 1: Using Chrome DevTools (Desktop)
1. Open the website in Chrome
2. Press `F12` or right-click → Inspect
3. Click the device toolbar icon (Ctrl+Shift+M)
4. Select a mobile device from dropdown (e.g., iPhone 12 Pro, Galaxy S20)
5. Refresh the page
6. Test all functionality

### Option 2: Test on Actual Phone (Recommended)
1. Ensure your phone and computer are on the same network
2. Open a terminal/command prompt
3. Run a local server (if not already running)
4. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` (look for inet)
5. On your phone's browser, visit: `http://[YOUR-IP-ADDRESS]:[PORT]`

### Option 3: Using Browser's Responsive Mode
1. Open the website in any modern browser
2. Right-click → Inspect Element
3. Toggle device toolbar
4. Test different screen sizes

## Key Things to Test on Mobile

### ✅ Navigation
- [ ] Click the hamburger menu (☰) - should open drawer from right
- [ ] All menu items should be visible and clickable
- [ ] Theme toggle (🌙/☀️) should work
- [ ] Close drawer by clicking X or outside the drawer
- [ ] Drawer should close when clicking a link

### ✅ Hero Section
- [ ] Heading should be readable (not too large or small)
- [ ] Text should be centered
- [ ] Phone mockup should display below the text
- [ ] "Download for Android" button should be full-width and centered

### ✅ Screenshots Section
- [ ] Device selector (Mobile/Tablet) should be visible and centered
- [ ] Swipe left/right to change screenshots - **SHOULD NOT scroll page**
- [ ] Page should NOT jump to screenshots section automatically
- [ ] "Prev/Next" buttons at bottom should work
- [ ] Progress bar should update as you navigate
- [ ] Images should load properly

### ✅ Content Sections
- [ ] Stats should display in single column
- [ ] Feature cards should stack vertically
- [ ] All text should be readable
- [ ] No content should be cut off

### ✅ Footer
- [ ] All links should be accessible
- [ ] Content should be centered
- [ ] Sections should stack vertically

### ✅ General
- [ ] No horizontal scrolling on any page
- [ ] All buttons are easy to tap (44px minimum)
- [ ] Theme switching works (light/dark)
- [ ] Page loads quickly
- [ ] Smooth scrolling animations

## Common Issues to Look For

1. **If menu not showing**: Check that hamburger icon (☰) is visible in top-right
2. **If page jumps**: Make sure you're on the latest version with the JavaScript fix
3. **If horizontal scroll appears**: Check console for errors, may need to identify the culprit element
4. **If text is too small/large**: Verify viewport meta tag is present

## Browser Compatibility

Tested and optimized for:
- ✅ Chrome (Android & iOS)
- ✅ Safari (iOS)
- ✅ Firefox (Android)
- ✅ Samsung Internet
- ✅ Edge Mobile

## Screen Sizes Optimized

- 📱 **Small phones**: 320px - 374px
- 📱 **Standard phones**: 375px - 767px
- 📱 **Large phones**: 768px - 899px
- 💻 **Tablets & Desktop**: 900px+

## Landscape Mode
- The website also works in landscape mode
- Hero section adapts to two-column layout in landscape

## Performance Notes

The website should:
- Load quickly on mobile networks
- Scroll smoothly without lag
- Have smooth slider transitions
- Not cause excessive battery drain

## Reporting Issues

If you find any issues:
1. Note the screen size (e.g., iPhone 12, 390x844)
2. Note the browser (e.g., Safari iOS 16)
3. Describe what's wrong
4. Take a screenshot if possible
5. Check browser console for errors (in DevTools)

## Quick Fixes

### If something looks broken:
1. **Hard refresh**: Ctrl+Shift+R (desktop) or clear cache (mobile)
2. **Check CSS loaded**: View source, ensure mobile-responsive.css is linked
3. **Check JavaScript**: Open console (F12), look for errors
4. **Test in incognito**: Rules out extension conflicts

---

## Success Criteria ✅

Your mobile website is working correctly if:
- ✅ Navigation menu is accessible and works smoothly
- ✅ Content is readable without zooming
- ✅ Screenshots slider doesn't cause page jumps
- ✅ No horizontal scrolling occurs
- ✅ All interactive elements are easily tappable
- ✅ Page loads and performs well
- ✅ Works across different phone sizes and browsers
