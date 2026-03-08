from PIL import Image

# Open the image
img = Image.open('src/assets/logo.png')

# The image is 2895x688. 
# We want the square 'Z' part on the left.
# Assuming it's roughly square, we can crop a 688x688 section from the left edge.
# (left, upper, right, lower)
z_mark = img.crop((0, 0, 688, 688))
z_mark.save('src/assets/logo-mark.png')

print("Cropped logo saved to src/assets/logo-mark.png")
