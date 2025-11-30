# ใช้ Nginx สำหรับ serve static HTML
FROM nginx:1.27-alpine

# Copy ไฟล์ HTML ไปยัง Nginx web root
COPY longan_map.html /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]