#!/bin/bash

# Medical professional images
curl -L -o public/images/doctors/doctor.jpg "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=500"
curl -L -o public/images/doctors/medical.png "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400"

# Medical equipment and services
curl -L -o public/images/services/back-pain.jpg "https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=300"
curl -L -o public/images/services/wrist-joint-pain.jpg "https://images.pexels.com/photos/7659731/pexels-photo-7659731.jpeg?auto=compress&cs=tinysrgb&w=300"
curl -L -o public/images/services/neck-pain.jpg "https://images.pexels.com/photos/7659566/pexels-photo-7659566.jpeg?auto=compress&cs=tinysrgb&w=300"
curl -L -o public/images/services/headache.jpg "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=300"
curl -L -o public/images/services/knee-pain.jpg "https://images.pexels.com/photos/7659730/pexels-photo-7659730.jpeg?auto=compress&cs=tinysrgb&w=300"

# Medical resources
curl -L -o public/images/resources/stethoscope.png "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=300"
curl -L -o public/images/resources/patient.png "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200"

# Logo (medical cross or similar)
curl -L -o public/images/logo.png "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=100"

echo "All medical images downloaded successfully!"
