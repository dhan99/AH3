# Refactoring Plan for Product Components

## Current Situation

We currently have two separate components for displaying product information:

1. **ProductCard**: A simpler component that displays basic product information
   - Used in `submission/page.tsx` for showing basic product information 
   - Lacks the detailed coverage information and styling from the Figma design

2. **ProductDetailCard**: An enhanced component created for the coverage section
   - Implements the complete Figma design including cost highlights
   - Shows detailed coverage information when selected
   - Has better icon alignment and text formatting

## Refactoring Plan

We should refactor the application to use `ProductDetailCard` consistently across all pages where product information is displayed. This will:

1. Provide a more consistent UI experience
2. Reduce code duplication
3. Allow for centralized updates to product display logic
4. Ensure all pages follow the Figma design specifications

## Implementation Steps

1. **Update ProductDetailCard Interface**
   - Make sure it can handle all use cases from both current components
   - Implement an optional parameter to control whether to show detailed coverage sections

2. **Replace ProductCard Usage in Submission Page**
   - Update the submission/page.tsx to use ProductDetailCard instead of ProductCard
   - Adapt the product data structure to match the new component's requirements

3. **Update References in Other Pages**
   - Find all other places using ProductCard and update them to use ProductDetailCard

4. **Consolidate Styling**
   - Ensure consistent styling across all instances
   - Follow the Figma design guidelines

5. **Testing**
   - Test all affected pages to ensure proper functionality
   - Verify visual consistency matches the Figma design

## Benefits of Refactoring

- **Consistency**: All product displays will share the same visual design and behavior
- **Maintainability**: Changes to product display logic only need to be made in one place
- **Design Fidelity**: Better adherence to the Figma design specifications
- **Future Proofing**: Easier to update all product displays if requirements change
