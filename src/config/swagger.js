const swaggerDefinition = {
    openapi: '3.0.3',

    info: {
        title: 'VandyCare Backend API',
        version: '2.0.0',
        description:
            'OpenAPI documentation for the Patient mobile, Doctor portal, and Admin panel APIs.'
    },

    servers: [
        {
            url: 'https://vandycareapis.vandytrust.com',
            description: 'Production server'
        },
        {
            url: 'http://localhost:5000',
            description: 'Local server'
        }
    ],

    tags: [
        {
            name: 'Patient',
            description: 'Patient mobile application APIs'
        },
        {
            name: 'Doctor',
            description: 'Doctor Web Portal APIs'
        },
        {
            name: 'Admin',
            description: 'Administrator Web Panel APIs'
        },
        {
            name: 'Video Call',
            description: [
                'Appointment video call sessions and WebRTC ICE configuration.',
                '',
                'Socket.IO signaling uses the server root namespace.',
                'Authenticate the handshake with a valid access token in auth.token.',
                'Only PATIENT and active DOCTOR accounts may connect.',
                'After call:accept, both participants send call:join with { callSessionId }.',
                'Once both have joined, the server emits call:joined and the session becomes ACTIVE.',
                'The patient sends call:offer; the doctor sends call:answer.',
                'Either participant may send call:ice-candidate.',
                'The doctor may send call:reject.',
                'Either participant may send call:end.'
            ].join('\n')
        }
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },

        schemas: {

            // =====================================================
            // COMMON
            // =====================================================

            Error: {
                type: 'object',
                required: ['success', 'message'],
                properties: {
                    success: {
                        type: 'boolean',
                        example: false
                    },
                    message: {
                        type: 'string'
                    },
                    cooldown_seconds: {
                        type: 'integer'
                    },
                    remaining_attempts: {
                        type: 'integer'
                    }
                }
            },

            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    phone: {
                        type: 'string'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        nullable: true
                    },
                    role: {
                        type: 'string',
                        enum: ['PATIENT', 'DOCTOR', 'ADMIN']
                    },
                    name: {
                        type: 'string'
                    },
                    isProfileCompleted: {
                        type: 'boolean'
                    }
                }
            },

            AuthResponse: {
                type: 'object',
                required: ['success', 'data'],
                properties: {
                    success: {
                        type: 'boolean'
                    },
                    data: {
                        type: 'object',
                        required: [
                            'accessToken',
                            'refreshToken',
                            'user'
                        ],
                        properties: {
                            accessToken: {
                                type: 'string'
                            },
                            refreshToken: {
                                type: 'string'
                            },
                            user: {
                                $ref: '#/components/schemas/User'
                            }
                        }
                    },
                    access_token: {
                        type: 'string'
                    },
                    refresh_token: {
                        type: 'string'
                    },
                    user_id: {
                        type: 'string'
                    },
                    name: {
                        type: 'string'
                    },
                    phone: {
                        type: 'string'
                    },
                    role: {
                        type: 'string',
                        enum: ['PATIENT', 'DOCTOR']
                    },
                    is_profile_completed: {
                        type: 'boolean'
                    }
                }
            },

            // =====================================================
            // PATIENT
            // =====================================================

            Profile: {
                type: 'object',
                required: [
                    'name',
                    'gender',
                    'bloodGroup',
                    'age',
                    'email'
                ],
                properties: {
                    name: {
                        type: 'string'
                    },
                    gender: {
                        type: 'string',
                        enum: ['MALE', 'FEMALE', 'OTHER']
                    },
                    bloodGroup: {
                        type: 'string',
                        enum: [
                            'A+',
                            'A-',
                            'B+',
                            'B-',
                            'AB+',
                            'AB-',
                            'O+',
                            'O-'
                        ]
                    },
                    age: {
                        type: 'integer',
                        minimum: 0,
                        example: 21
                    },
                    email: {
                        type: 'string',
                        format: 'email'
                    },
                    image: {
                        type: 'string',
                        nullable: true
                    }
                }
            },

            Doctor: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    name: {
                        type: 'string'
                    },
                    profile_image: {
                        type: 'string',
                        nullable: true
                    },
                    avatar: {
                        type: 'string',
                        nullable: true
                    },
                    specialty: {
                        type: 'string',
                        nullable: true
                    },
                    qualification: {
                        type: 'string',
                        nullable: true
                    },
                    experience_years: {
                        type: 'integer',
                        nullable: true
                    },
                    experienceYears: {
                        type: 'integer',
                        nullable: true
                    },
                    rating: {
                        type: 'number'
                    },
                    review_count: {
                        type: 'integer'
                    },
                    reviewCount: {
                        type: 'integer'
                    },
                    consultation_fee: {
                        type: 'number',
                        nullable: true
                    },
                    consultationFee: {
                        type: 'number',
                        nullable: true
                    },
                    is_online: {
                        type: 'boolean'
                    },
                    isOnline: {
                        type: 'boolean'
                    },
                    isVerified: {
                        type: 'boolean'
                    },
                    clinicName: {
                        type: 'string',
                        nullable: true
                    },
                    clinicAddress: {
                        type: 'string',
                        nullable: true
                    },
                    location: {},
                    distance_km: {
                        type: 'number',
                        nullable: true
                    },
                    distanceKm: {
                        type: 'number',
                        nullable: true
                    },
                    registrationNumber: {
                        type: 'string',
                        nullable: true
                    },
                    about: {
                        type: 'string',
                        nullable: true
                    }
                }
            },

            Appointment: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    appointmentId: {
                        type: 'string'
                    },
                    doctorId: {
                        type: 'string'
                    },
                    slotId: {
                        type: 'string'
                    },
                    doctorName: {
                        type: 'string',
                        nullable: true
                    },
                    doctorAvatar: {
                        type: 'string',
                        nullable: true
                    },
                    doctorSpecialty: {
                        type: 'string',
                        nullable: true
                    },
                    type: {
                        type: 'string',
                        enum: ['VIDEO', 'AUDIO', 'CHAT']
                    },
                    consultationType: {
                        type: 'string',
                        example: 'VIDEO'
                    },
                    status: {
                        type: 'string',
                        enum: [
                            'PENDING_PAYMENT',
                            'UPCOMING',
                            'COMPLETED',
                            'CANCELLED'
                        ]
                    },
                    date: {
                        type: 'string',
                        format: 'date',
                        nullable: true
                    },
                    time: {
                        type: 'string',
                        nullable: true
                    },
                    symptoms: {
                        type: 'string',
                        nullable: true
                    },
                    prescriptionId: {
                        type: 'string',
                        nullable: true
                    },
                    consultationFee: {
                        type: 'number'
                    },
                    platformFee: {
                        type: 'number'
                    },
                    totalAmount: {
                        type: 'number'
                    },
                    fees: {
                        type: 'object',
                        properties: {
                            consultationFee: {
                                type: 'number'
                            },
                            platformFee: {
                                type: 'number'
                            },
                            totalAmount: {
                                type: 'number'
                            }
                        }
                    },
                    paymentId: {
                        type: 'string',
                        nullable: true
                    },
                    paymentStatus: {
                        type: 'string',
                        enum: [
                            'PENDING',
                            'PAID',
                            'SUCCESS',
                            'FAILED',
                            'REFUNDED'
                        ]
                    }
                }
            },

            Medicine: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    name: {
                        type: 'string'
                    },
                    dosage: {
                        type: 'string'
                    },
                    frequency: {
                        type: 'string'
                    },
                    duration: {
                        type: 'string'
                    },
                    instructions: {
                        type: 'string'
                    }
                }
            },

            Prescription: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    patient_id: {
                        type: 'string'
                    },
                    patientId: {
                        type: 'string'
                    },
                    doctor_id: {
                        type: 'string'
                    },
                    doctorId: {
                        type: 'string'
                    },
                    doctor_name: {
                        type: 'string'
                    },
                    doctorName: {
                        type: 'string',
                        nullable: true
                    },
                    doctor_specialty: {
                        type: 'string',
                        nullable: true
                    },
                    doctorSpecialty: {
                        type: 'string',
                        nullable: true
                    },
                    doctor_registration_number: {
                        type: 'string',
                        nullable: true
                    },
                    doctorReg: {
                        type: 'string',
                        nullable: true
                    },
                    date: {
                        type: 'string',
                        format: 'date-time'
                    },
                    diagnosis: {
                        type: 'string'
                    },
                    medicines: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Medicine'
                        }
                    }
                }
            },

            Consultation: {
                type: 'object',
                properties: {
                    consultation_id: {
                        type: 'string'
                    },
                    doctor_id: {
                        type: 'string'
                    },
                    patient_id: {
                        type: 'string'
                    },
                    doctor_name: {
                        type: 'string'
                    },
                    doctor_specialty: {
                        type: 'string'
                    },
                    patient_name: {
                        type: 'string'
                    },
                    channel_name: {
                        type: 'string'
                    },
                    scheduled_at: {
                        type: 'string',
                        nullable: true
                    },
                    status: {
                        type: 'string'
                    },
                    created_at: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            },

            Order: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    user_id: {
                        type: 'string'
                    },
                    items: {
                        type: 'array',
                        items: {}
                    },
                    status: {
                        type: 'string',
                        enum: ['PLACED']
                    },
                    created_at: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            },

            HomeResponse: {
                type: 'object',
                properties: {
                    patient: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string'
                            },
                            name: {
                                type: 'string'
                            },
                            phone: {
                                type: 'string'
                            },
                            email: {
                                type: 'string'
                            },
                            avatar: {
                                type: 'string',
                                nullable: true
                            },
                            city: {
                                type: 'string'
                            }
                        }
                    },
                    location: {
                        type: 'object',
                        properties: {
                            city: {
                                type: 'string'
                            },
                            latitude: {
                                type: 'number',
                                nullable: true
                            },
                            longitude: {
                                type: 'number',
                                nullable: true
                            }
                        }
                    },
                    notifications: {
                        type: 'object',
                        properties: {
                            unreadCount: {
                                type: 'integer'
                            }
                        }
                    },
                    specialities: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string'
                                },
                                name: {
                                    type: 'string'
                                },
                                icon: {
                                    type: 'string',
                                    nullable: true
                                }
                            }
                        }
                    },
                    upcomingAppointment: {
                        allOf: [
                            {
                                $ref: '#/components/schemas/Appointment'
                            }
                        ],
                        nullable: true
                    },
                    nearbyDoctors: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Doctor'
                        }
                    },
                    previousAppointments: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Appointment'
                        }
                    },
                    recentPrescriptions: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Prescription'
                        }
                    }
                }
            },

            DoctorProfile: {
                allOf: [
                    {
                        $ref: '#/components/schemas/Doctor'
                    }
                ],
                properties: {
                    availableSlots: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/AppointmentSlot'
                        }
                    },
                    reviews: {
                        type: 'array',
                        items: {
                            type: 'object',
                            additionalProperties: true
                        }
                    }
                }
            },

            AppointmentSlot: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    doctorId: {
                        type: 'string'
                    },
                    date: {
                        type: 'string',
                        format: 'date'
                    },
                    time: {
                        type: 'string',
                        example: '09:00'
                    },
                    period: {
                        type: 'string',
                        enum: ['AM', 'PM'],
                        nullable: true
                    },
                    available: {
                        type: 'boolean'
                    },
                    bookedAppointmentId: {
                        type: 'string',
                        nullable: true
                    }
                }
            },

            Payment: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    appointmentId: {
                        type: 'string'
                    },
                    amount: {
                        type: 'integer'
                    },
                    method: {
                        type: 'string',
                        enum: [
                            'UPI',
                            'CARD',
                            'NET_BANKING',
                            'WALLET'
                        ]
                    },
                    status: {
                        type: 'string',
                        enum: [
                            'PENDING',
                            'SUCCESS',
                            'FAILED',
                            'REFUNDED'
                        ]
                    },
                    transactionReference: {
                        type: 'string',
                        nullable: true
                    },
                    refundStatus: {
                        type: 'string',
                        nullable: true
                    }
                }
            },

            // =====================================================
            // DOCTOR PORTAL
            // =====================================================

            PortalAuthResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean'
                    },
                    data: {
                        type: 'object',
                        properties: {
                            accessToken: {
                                type: 'string'
                            },
                            user: {
                                $ref: '#/components/schemas/User'
                            }
                        }
                    },
                    access_token: {
                        type: 'string'
                    }
                }
            },

            DoctorRegistration: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    userId: {
                        type: 'string'
                    },
                    name: {
                        type: 'string'
                    },
                    email: {
                        type: 'string',
                        format: 'email'
                    },
                    mobile: {
                        type: 'string'
                    },
                    specialization: {
                        type: 'string'
                    },
                    qualification: {
                        type: 'string'
                    },
                    experience: {
                        type: 'number',
                        nullable: true
                    },
                    registrationNumber: {
                        type: 'string'
                    },
                    status: {
                        type: 'string',
                        enum: [
                            'PENDING',
                            'APPROVED',
                            'REJECTED'
                        ]
                    },
                    registrationDate: {
                        type: 'string',
                        format: 'date-time'
                    },
                    rejectionReason: {
                        type: 'string',
                        nullable: true
                    }
                }
            },

            DoctorPortalProfile: {
                allOf: [
                    {
                        $ref: '#/components/schemas/DoctorRegistration'
                    }
                ],
                properties: {
                    isActive: {
                        type: 'boolean'
                    },
                    clinicName: {
                        type: 'string',
                        nullable: true
                    },
                    clinicAddress: {
                        type: 'string',
                        nullable: true
                    },
                    bio: {
                        type: 'string',
                        nullable: true
                    }
                }
            },

            DoctorAppointment: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    appointmentId: {
                        type: 'string'
                    },
                    patientId: {
                        type: 'string'
                    },
                    patientName: {
                        type: 'string',
                        nullable: true
                    },
                    patientPhone: {
                        type: 'string',
                        nullable: true
                    },
                    doctorId: {
                        type: 'string'
                    },
                    doctorName: {
                        type: 'string',
                        nullable: true
                    },
                    type: {
                        type: 'string',
                        enum: [
                            'VIDEO',
                            'AUDIO',
                            'CHAT'
                        ]
                    },
                    consultationType: {
                        type: 'string',
                        nullable: true
                    },
                    status: {
                        type: 'string'
                    },
                    date: {
                        type: 'string',
                        format: 'date',
                        nullable: true
                    },
                    time: {
                        type: 'string',
                        nullable: true
                    },
                    symptoms: {
                        type: 'string',
                        nullable: true
                    },
                    consultationFee: {
                        type: 'number',
                        nullable: true
                    },
                    platformFee: {
                        type: 'number',
                        nullable: true
                    },
                    totalAmount: {
                        type: 'number',
                        nullable: true
                    },
                    paymentId: {
                        type: 'string',
                        nullable: true
                    },
                    paymentStatus: {
                        type: 'string',
                        nullable: true
                    }
                }
            },

            DoctorPatient: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    name: {
                        type: 'string',
                        nullable: true
                    },
                    phone: {
                        type: 'string',
                        nullable: true
                    },
                    email: {
                        type: 'string',
                        nullable: true
                    },
                    isProfileCompleted: {
                        type: 'boolean'
                    }
                }
            },

            CallSession: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    appointmentId: {
                        type: 'string'
                    },
                    patientId: {
                        type: 'string'
                    },
                    doctorId: {
                        type: 'string'
                    },
                    status: {
                        type: 'string',
                        enum: [
                            'RINGING',
                            'ACCEPTED',
                            'ACTIVE',
                            'REJECTED',
                            'MISSED',
                            'ENDED'
                        ]
                    },
                    startedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true
                    },
                    endedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            },

            // =====================================================
            // ADMIN
            // =====================================================

            AdminPatient: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    name: {
                        type: 'string',
                        nullable: true
                    },
                    email: {
                        type: 'string',
                        nullable: true
                    },
                    mobile: {
                        type: 'string',
                        nullable: true
                    },
                    role: {
                        type: 'string',
                        enum: ['PATIENT']
                    },
                    profile: {
                        $ref: '#/components/schemas/Profile'
                    },
                    isProfileCompleted: {
                        type: 'boolean'
                    }
                }
            }
        }
    },

    // =========================================================
    // PATHS
    // =========================================================

    paths: {

        // =====================================================
        // SYSTEM
        // =====================================================

        '/health': {
            get: {
                tags: ['System'],
                summary: 'Check service health',
                description:
                    'Returns service and configuration availability flags.',
                responses: {
                    200: {
                        description: 'Service health'
                    }
                }
            }
        },

        '/v1/health': {
            get: {
                tags: ['System'],
                summary: 'Check service health',
                description:
                    'Returns service and configuration availability flags.',
                responses: {
                    200: {
                        description: 'Service health'
                    }
                }
            }
        },

        // =====================================================
        // VIDEO CALL / WEBRTC
        // =====================================================

        '/v1/video-call/ice-servers': {
            get: {
                tags: ['Video Call'],
                summary: 'Get WebRTC ICE servers',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Configured STUN and TURN servers'
                    },
                    401: {
                        $ref: '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        '/v1/appointments/{appointmentId}/call/start': {
            post: {
                tags: ['Video Call'],
                summary: 'Start a call',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    201: {
                        description:
                            'Ringing call session created'
                    },
                    403: {
                        $ref: '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref: '#/components/responses/NotFound'
                    },
                    409: {
                        description:
                            'An active call already exists'
                    },
                    401: {
                        $ref: '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        '/v1/appointments/{appointmentId}/call/accept': {
            post: {
                tags: ['Video Call'],
                summary: 'Accept a call',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Call accepted'
                    },
                    403: {
                        $ref: '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref: '#/components/responses/NotFound'
                    },
                    409: {
                        description:
                            'Invalid call status transition'
                    },
                    401: {
                        $ref: '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        '/v1/appointments/{appointmentId}/call/reject': {
            post: {
                tags: ['Video Call'],
                summary: 'Reject a call',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Call rejected'
                    },
                    403: {
                        $ref: '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref: '#/components/responses/NotFound'
                    },
                    409: {
                        description:
                            'Invalid call status transition'
                    },
                    401: {
                        $ref: '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        '/v1/appointments/{appointmentId}/call/end': {
            post: {
                tags: ['Video Call'],
                summary: 'End a call',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Call ended'
                    },
                    403: {
                        $ref: '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref: '#/components/responses/NotFound'
                    },
                    409: {
                        description:
                            'Invalid call status transition'
                    },
                    401: {
                        $ref: '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        '/v1/appointments/{appointmentId}/call': {
            get: {
                tags: ['Video Call'],
                summary:
                    'Get the appointment call session',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Call session'
                    },
                    403: {
                        $ref: '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref: '#/components/responses/NotFound'
                    },
                    401: {
                        $ref: '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        // =====================================================
        // AUTH
        // =====================================================

        '/v1/auth/send-otp': {
            post: {
                tags: ['Auth'],
                summary: 'Send OTP',
                description:
                    'Sends a four-digit OTP to a registered phone number.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: [
                                    'phone',
                                    'role'
                                ],
                                properties: {
                                    phone: {
                                        type: 'string',
                                        example:
                                            '+919876543211'
                                    },
                                    role: {
                                        type: 'string',
                                        enum: [
                                            'PATIENT',
                                            'DOCTOR'
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'OTP sent'
                    },
                    400: {
                        $ref: '#/components/responses/BadRequest'
                    },
                    404: {
                        $ref: '#/components/responses/NotFound'
                    },
                    429: {
                        $ref: '#/components/responses/TooManyRequests'
                    },
                    500: {
                        $ref: '#/components/responses/ServerError'
                    }
                }
            }
        },

        '/v1/auth/verify-otp': {
            post: {
                tags: ['Auth'],
                summary:
                    'Verify OTP and issue tokens',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: [
                                    'phone',
                                    'otp',
                                    'role'
                                ],
                                properties: {
                                    phone: {
                                        type: 'string'
                                    },
                                    otp: {
                                        type: 'string',
                                        pattern: '^\\d{4}$'
                                    },
                                    role: {
                                        type: 'string',
                                        enum: [
                                            'PATIENT',
                                            'DOCTOR'
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description:
                            'Authenticated user',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref:
                                        '#/components/schemas/AuthResponse'
                                }
                            }
                        }
                    },
                    400: {
                        $ref: '#/components/responses/BadRequest'
                    },
                    401: {
                        $ref: '#/components/responses/Unauthorized'
                    },
                    429: {
                        $ref: '#/components/responses/TooManyRequests'
                    },
                    500: {
                        $ref: '#/components/responses/ServerError'
                    }
                }
            }
        },

        '/v1/auth/refresh': {
            post: {
                tags: ['Auth'],
                summary: 'Rotate refresh token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: [
                                    'refreshToken'
                                ],
                                properties: {
                                    refreshToken: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description:
                            'New access and refresh tokens',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref:
                                        '#/components/schemas/AuthResponse'
                                }
                            }
                        }
                    },
                    401: {
                        description:
                            'Invalid, expired, or revoked refresh token',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref:
                                        '#/components/schemas/Error'
                                }
                            }
                        }
                    }
                }
            }
        },

        '/v1/auth/refresh-token': {
            post: {
                tags: ['Auth'],
                summary:
                    'Rotate refresh token (legacy alias)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: [
                                    'refreshToken'
                                ],
                                properties: {
                                    refreshToken: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'New tokens'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        '/v1/auth/logout': {
            post: {
                tags: ['Auth'],
                summary:
                    'Revoke refresh session',
                description:
                    'Revokes the supplied refresh token. Supplying no token revokes all sessions for an authenticated caller.',
                requestBody: {
                    required: false,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    refreshToken: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Logged out'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        // =====================================================
        // PATIENT PROFILE
        // =====================================================

        '/v1/profile': {
            get: {
                tags: ['Profile'],
                summary: 'Get profile',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Profile returned'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    }
                }
            },

            post: {
                tags: ['Profile'],
                summary: 'Create profile',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    $ref:
                        '#/components/requestBodies/Profile'
                },
                responses: {
                    200: {
                        $ref:
                            '#/components/responses/ProfileSaved'
                    },
                    400: {
                        $ref:
                            '#/components/responses/BadRequest'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    }
                }
            },

            put: {
                tags: ['Profile'],
                summary: 'Update profile',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    $ref:
                        '#/components/requestBodies/Profile'
                },
                responses: {
                    200: {
                        $ref:
                            '#/components/responses/ProfileSaved'
                    },
                    400: {
                        $ref:
                            '#/components/responses/BadRequest'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        // =====================================================
        // HOME
        // =====================================================

        '/v1/home': {
            get: {
                tags: ['Home'],
                summary: 'Fetch home data',
                description:
                    'Returns patient-specific home dashboard data.',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        $ref:
                            '#/components/responses/Home'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    500: {
                        $ref:
                            '#/components/responses/ServerError'
                    }
                }
            }
        },

        '/api/home': {
            get: {
                tags: ['Home'],
                summary: 'Fetch home data',
                description:
                    'Alias of the patient home dashboard endpoint.',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        $ref:
                            '#/components/responses/Home'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    500: {
                        $ref:
                            '#/components/responses/ServerError'
                    }
                }
            }
        },

        // =====================================================
        // DOCTORS
        // =====================================================

        '/v1/doctors': {
            get: {
                tags: ['Doctors'],
                summary: 'List doctors',
                description:
                    'Lists doctors with optional text, specialty, location, rating, fee, experience, and online filters.',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        $ref:
                            '#/components/parameters/Search'
                    },
                    {
                        name: 'specialty',
                        in: 'query',
                        schema: {
                            type: 'string',
                            enum: [
                                'general physician',
                                'cardiology',
                                'dermatology',
                                'pediatrics',
                                'neurology'
                            ]
                        }
                    },
                    {
                        name: 'latitude',
                        in: 'query',
                        schema: {
                            type: 'number',
                            minimum: -90,
                            maximum: 90
                        }
                    },
                    {
                        name: 'longitude',
                        in: 'query',
                        schema: {
                            type: 'number',
                            minimum: -180,
                            maximum: 180
                        }
                    },
                    {
                        name: 'maxDistance',
                        in: 'query',
                        schema: {
                            type: 'number',
                            minimum: 0
                        }
                    },
                    {
                        name: 'minRating',
                        in: 'query',
                        schema: {
                            type: 'number',
                            minimum: 0,
                            maximum: 5
                        }
                    },
                    {
                        name: 'maxFee',
                        in: 'query',
                        schema: {
                            type: 'number',
                            minimum: 0
                        }
                    },
                    {
                        name: 'minExperience',
                        in: 'query',
                        schema: {
                            type: 'number',
                            minimum: 0
                        }
                    },
                    {
                        name: 'onlineOnly',
                        in: 'query',
                        schema: {
                            type: 'boolean',
                            default: false
                        }
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        schema: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 100,
                            default: 20
                        }
                    },
                    {
                        name: 'offset',
                        in: 'query',
                        schema: {
                            type: 'integer',
                            minimum: 0,
                            default: 0
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Doctor list'
                    },
                    400: {
                        $ref:
                            '#/components/responses/BadRequest'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        '/v1/doctors/{doctorId}': {
            get: {
                tags: ['Doctors'],
                summary: 'Get doctor profile',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'doctorId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Doctor profile'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        '/v1/doctors/{doctorId}/slots': {
            get: {
                tags: ['Doctors'],
                summary: 'Get doctor slots',
                description:
                    'Returns slots generated from the doctor working schedule for the requested date, including unavailable booked slots.',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'doctorId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        },
                        example: 'doc_101'
                    },
                    {
                        name: 'date',
                        in: 'query',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'date'
                        },
                        example: '2026-10-02'
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Doctor slots'
                    },
                    400: {
                        $ref:
                            '#/components/responses/BadRequest'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        // =====================================================
        // SPECIALTIES
        // =====================================================

        '/v1/specialties': {
            get: {
                tags: ['Specialties'],
                summary: 'List specialties',
                description:
                    'Returns configured specialties and doctor counts.',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Specialties'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        '/v1/specialities': {
            get: {
                tags: ['Specialties'],
                summary: 'List specialities',
                description:
                    'Alias using the patient app spelling.',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Specialities'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        // =====================================================
        // ORDERS
        // =====================================================

        '/v1/orders/{id}/tracking': {
            get: {
                tags: ['Orders'],
                summary: 'Track order',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        $ref:
                            '#/components/parameters/Id'
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Order tracking'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        // =====================================================
        // PATIENT APPOINTMENTS
        // =====================================================

        '/v1/appointments': {
            get: {
                tags: ['Appointments'],
                summary:
                    'List patient appointments',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'status',
                        in: 'query',
                        schema: {
                            type: 'string',
                            enum: [
                                'UPCOMING',
                                'COMPLETED',
                                'CANCELLED'
                            ]
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Patient appointments'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    }
                }
            },

            post: {
                tags: ['Appointments'],
                summary:
                    'Create appointment booking',
                description:
                    'Books the selected available doctor slot.',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: [
                                    'doctorId',
                                    'slotId',
                                    'consultationType'
                                ],
                                properties: {
                                    doctorId: {
                                        type: 'string'
                                    },
                                    slotId: {
                                        type: 'string'
                                    },
                                    date: {
                                        type: 'string',
                                        format: 'date'
                                    },
                                    slotDate: {
                                        type: 'string',
                                        format: 'date'
                                    },
                                    consultationType: {
                                        type: 'string',
                                        enum: [
                                            'VIDEO',
                                            'AUDIO',
                                            'CHAT'
                                        ]
                                    },
                                    symptoms: {
                                        type: 'string',
                                        nullable: true
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description:
                            'Appointment created with pending payment'
                    },
                    400: {
                        $ref:
                            '#/components/responses/BadRequest'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    },
                    409: {
                        $ref:
                            '#/components/responses/Conflict'
                    }
                }
            }
        },

        '/v1/appointments/{appointmentId}': {
            get: {
                tags: ['Appointments'],
                summary:
                    'Get patient appointment details',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Appointment details including fees and payment'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        '/v1/appointments/{appointmentId}/payment': {
            post: {
                tags: ['Appointments'],
                summary:
                    'Initiate appointment payment',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: [
                                    'paymentMethod'
                                ],
                                properties: {
                                    paymentMethod: {
                                        type: 'string',
                                        enum: [
                                            'UPI',
                                            'CARD',
                                            'NET_BANKING',
                                            'WALLET'
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description:
                            'Pending payment record and provider order information'
                    },
                    400: {
                        $ref:
                            '#/components/responses/BadRequest'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    },
                    409: {
                        $ref:
                            '#/components/responses/Conflict'
                    }
                }
            }
        },

        '/v1/appointments/{appointmentId}/cancel': {
            post: {
                tags: ['Appointments'],
                summary:
                    'Cancel patient appointment',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Appointment cancelled'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    },
                    409: {
                        $ref:
                            '#/components/responses/Conflict'
                    }
                }
            },

            put: {
                tags: ['Appointments'],
                summary:
                    'Cancel patient appointment (legacy method)',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Appointment cancelled'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    },
                    409: {
                        $ref:
                            '#/components/responses/Conflict'
                    }
                }
            }
        },

        // =====================================================
        // NOTIFICATIONS
        // =====================================================

        '/v1/notifications/unread-count': {
            get: {
                tags: ['Notifications'],
                summary:
                    'Get unread notification count',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Unread notification count'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        // =====================================================
        // PAYMENT WEBHOOK
        // =====================================================

        '/v1/payments/webhook': {
            post: {
                tags: ['Appointments'],
                summary:
                    'Process dummy payment webhook',
                description:
                    'Processes the dummy payment success payload without provider configuration or a signature header.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: [
                                    'paymentId',
                                    'status'
                                ],
                                properties: {
                                    paymentId: {
                                        type: 'string'
                                    },
                                    status: {
                                        type: 'string',
                                        enum: [
                                            'SUCCESS',
                                            'FAILED'
                                        ]
                                    },
                                    transactionReference: {
                                        type: 'string',
                                        nullable: true
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description:
                            'Dummy payment processed'
                    },
                    400: {
                        $ref:
                            '#/components/responses/BadRequest'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    },
                    409: {
                        $ref:
                            '#/components/responses/Conflict'
                    }
                }
            }
        },

        // =====================================================
        // DOCTOR PORTAL AUTH
        // =====================================================

        '/v1/doctor-portal/register': {
            post: {
                tags: ['Doctor'],
                summary: 'Register doctor',
                description:
                    'Public endpoint. Creates a doctor registration with PENDING status for administrator review.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: [
                                    'name',
                                    'email',
                                    'mobile',
                                    'password'
                                ],
                                properties: {
                                    name: {
                                        type: 'string'
                                    },
                                    email: {
                                        type: 'string',
                                        format: 'email'
                                    },
                                    mobile: {
                                        type: 'string'
                                    },
                                    password: {
                                        type: 'string',
                                        format: 'password',
                                        minLength: 8
                                    },
                                    specialization: {
                                        type: 'string'
                                    },
                                    qualification: {
                                        type: 'string'
                                    },
                                    experience: {
                                        type: 'number',
                                        minimum: 0
                                    },
                                    registrationNumber: {
                                        type: 'string'
                                    },
                                    clinicName: {
                                        type: 'string'
                                    },
                                    clinicAddress: {
                                        type: 'string'
                                    },
                                    bio: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description:
                            'Registration submitted'
                    },
                    400: {
                        $ref:
                            '#/components/responses/BadRequest'
                    }
                }
            }
        },

        '/v1/doctor-portal/login': {
            post: {
                tags: ['Doctor'],
                summary: 'Doctor login',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: [
                                    'email',
                                    'password'
                                ],
                                properties: {
                                    email: {
                                        type: 'string',
                                        format: 'email'
                                    },
                                    password: {
                                        type: 'string',
                                        format: 'password'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description:
                            'Doctor authenticated',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref:
                                        '#/components/schemas/PortalAuthResponse'
                                }
                            }
                        }
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    }
                }
            }
        },

        // =====================================================
        // DOCTOR PROFILE
        // =====================================================

        '/v1/doctor-portal/profile': {
            get: {
                tags: ['Doctor'],
                summary:
                    'Get own doctor profile',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Doctor profile'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            },

            patch: {
                tags: ['Doctor'],
                summary:
                    'Update own doctor profile',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref:
                                    '#/components/schemas/DoctorPortalProfile'
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description:
                            'Profile updated'
                    },
                    400: {
                        $ref:
                            '#/components/responses/BadRequest'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        '/v1/doctor-portal/status': {
            get: {
                tags: ['Doctor'],
                summary:
                    'Get doctor registration status',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Doctor status'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        // =====================================================
        // DOCTOR APPOINTMENTS
        // =====================================================

        '/v1/doctor-portal/appointments': {
            get: {
                tags: ['Doctor'],
                summary:
                    'List doctor appointments',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Appointments assigned to the authenticated doctor',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean'
                                        },
                                        data: {
                                            type: 'array',
                                            items: {
                                                $ref:
                                                    '#/components/schemas/DoctorAppointment'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    }
                }
            }
        },

        '/v1/doctor-portal/appointments/{appointmentId}': {
            get: {
                tags: ['Doctor'],
                summary:
                    'Get doctor appointment details',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Appointment details',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean'
                                        },
                                        data: {
                                            $ref:
                                                '#/components/schemas/DoctorAppointment'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        '/v1/doctor-portal/appointments/{appointmentId}/status': {
            patch: {
                tags: ['Doctor'],
                summary:
                    'Update appointment status',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['status'],
                                properties: {
                                    status: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description:
                            'Appointment status updated'
                    },
                    400: {
                        $ref:
                            '#/components/responses/BadRequest'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    },
                    409: {
                        $ref:
                            '#/components/responses/Conflict'
                    }
                }
            }
        },

        // =====================================================
        // DOCTOR PATIENTS
        // =====================================================

        '/v1/doctor-portal/patients': {
            get: {
                tags: ['Doctor'],
                summary:
                    'List doctor patients',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Patients associated with the authenticated doctor',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean'
                                        },
                                        data: {
                                            type: 'array',
                                            items: {
                                                $ref:
                                                    '#/components/schemas/DoctorPatient'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    }
                }
            }
        },

        '/v1/doctor-portal/patients/{patientId}': {
            get: {
                tags: ['Doctor'],
                summary:
                    'Get doctor patient details',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'patientId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Patient details',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean'
                                        },
                                        data: {
                                            $ref:
                                                '#/components/schemas/DoctorPatient'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        // =====================================================
        // DOCTOR VIDEO CALL
        // =====================================================

        '/v1/doctor-portal/appointments/{appointmentId}/call': {
            get: {
                tags: ['Doctor'],
                summary:
                    'Get appointment call session',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Call session',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean'
                                        },
                                        data: {
                                            $ref:
                                                '#/components/schemas/CallSession'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        '/v1/doctor-portal/appointments/{appointmentId}/call/accept': {
            post: {
                tags: ['Doctor'],
                summary:
                    'Accept incoming video call',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Call accepted'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    },
                    409: {
                        $ref:
                            '#/components/responses/Conflict'
                    }
                }
            }
        },

        '/v1/doctor-portal/appointments/{appointmentId}/call/reject': {
            post: {
                tags: ['Doctor'],
                summary:
                    'Reject incoming video call',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Call rejected'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    },
                    409: {
                        $ref:
                            '#/components/responses/Conflict'
                    }
                }
            }
        },

        '/v1/doctor-portal/appointments/{appointmentId}/call/end': {
            post: {
                tags: ['Doctor'],
                summary:
                    'End video call',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'appointmentId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Call ended'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    },
                    409: {
                        $ref:
                            '#/components/responses/Conflict'
                    }
                }
            }
        },

        // =====================================================
        // ADMIN
        // =====================================================

        '/v1/admin/login': {
            post: {
                tags: ['Admin'],
                summary: 'Admin login',
                description:
                    'Authenticates an administrator and returns a JWT access token.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: [
                                    'email',
                                    'password'
                                ],
                                properties: {
                                    email: {
                                        type: 'string',
                                        format: 'email'
                                    },
                                    password: {
                                        type: 'string',
                                        format: 'password'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description:
                            'Admin authenticated',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref:
                                        '#/components/schemas/PortalAuthResponse'
                                }
                            }
                        }
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        '/v1/admin/doctors/pending': {
            get: {
                tags: ['Admin'],
                summary:
                    'List pending doctor registrations',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Pending doctors'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    }
                }
            }
        },

        '/v1/admin/doctors': {
            get: {
                tags: ['Admin'],
                summary:
                    'List all doctors',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description:
                            'All doctors'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    }
                }
            }
        },

        '/v1/admin/doctors/{doctorId}': {
            get: {
                tags: ['Admin'],
                summary:
                    'Get doctor details',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'doctorId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Doctor details'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        '/v1/admin/doctors/{doctorId}/approve': {
            post: {
                tags: ['Admin'],
                summary:
                    'Approve doctor registration',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'doctorId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Doctor approved'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        '/v1/admin/doctors/{doctorId}/reject': {
            post: {
                tags: ['Admin'],
                summary:
                    'Reject doctor registration',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'doctorId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                requestBody: {
                    required: false,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    reason: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description:
                            'Doctor rejected'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        '/v1/admin/doctors/{doctorId}/activate': {
            post: {
                tags: ['Admin'],
                summary:
                    'Activate doctor',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'doctorId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Doctor activated'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        '/v1/admin/doctors/{doctorId}/deactivate': {
            post: {
                tags: ['Admin'],
                summary:
                    'Deactivate doctor',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'doctorId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Doctor deactivated'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        },

        '/v1/admin/patients': {
            get: {
                tags: ['Admin'],
                summary:
                    'List all patients',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description:
                            'All patients'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    }
                }
            }
        },

        '/v1/admin/patients/{patientId}': {
            get: {
                tags: ['Admin'],
                summary:
                    'Get patient details',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'patientId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    200: {
                        description:
                            'Patient details'
                    },
                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },
                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },
                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        }
    }
};


// =========================================================
// PARAMETERS
// =========================================================

swaggerDefinition.components.parameters = {

    Id: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Resource identifier',
        schema: {
            type: 'string'
        }
    },

    Search: {
        name: 'search',
        in: 'query',
        required: false,
        schema: {
            type: 'string'
        }
    }
};


// =========================================================
// REQUEST BODIES
// =========================================================

swaggerDefinition.components.requestBodies = {

    Profile: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref:
                        '#/components/schemas/Profile'
                }
            }
        }
    }
};


// =========================================================
// COMMON RESPONSES
// =========================================================

swaggerDefinition.components.responses = {

    BadRequest: {
        description:
            'Validation error',
        content: {
            'application/json': {
                schema: {
                    $ref:
                        '#/components/schemas/Error'
                }
            }
        }
    },

    Unauthorized: {
        description:
            'Missing, invalid, or expired Bearer token',
        content: {
            'application/json': {
                schema: {
                    $ref:
                        '#/components/schemas/Error'
                }
            }
        }
    },

    Forbidden: {
        description:
            'Authenticated user is not allowed',
        content: {
            'application/json': {
                schema: {
                    $ref:
                        '#/components/schemas/Error'
                }
            }
        }
    },

    NotFound: {
        description:
            'Resource not found',
        content: {
            'application/json': {
                schema: {
                    $ref:
                        '#/components/schemas/Error'
                }
            }
        }
    },

    Conflict: {
        description:
            'Resource conflict',
        content: {
            'application/json': {
                schema: {
                    $ref:
                        '#/components/schemas/Error'
                }
            }
        }
    },

    TooManyRequests: {
        description:
            'Rate or OTP attempt limit reached',
        content: {
            'application/json': {
                schema: {
                    $ref:
                        '#/components/schemas/Error'
                }
            }
        }
    },

    ServiceUnavailable: {
        description:
            'Authentication service is not configured',
        content: {
            'application/json': {
                schema: {
                    $ref:
                        '#/components/schemas/Error'
                }
            }
        }
    },

    ServerError: {
        description:
            'Server error',
        content: {
            'application/json': {
                schema: {
                    $ref:
                        '#/components/schemas/Error'
                }
            }
        }
    },

    ProfileSaved: {
        description:
            'Profile saved',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean'
                        },
                        profile: {
                            $ref:
                                '#/components/schemas/Profile'
                        },
                        is_profile_completed: {
                            type: 'boolean'
                        }
                    }
                }
            }
        }
    },

    Home: {
        description:
            'Home dashboard',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean'
                        },
                        message: {
                            type: 'string',
                            example:
                                'Home data fetched successfully'
                        },
                        data: {
                            $ref:
                                '#/components/schemas/HomeResponse'
                        }
                    }
                }
            }
        }
    }
};


// =========================================================
// FINAL TAG NORMALIZATION
// =========================================================

Object.entries(swaggerDefinition.paths).forEach(
    ([path, operations]) => {

        const tag =
            path.startsWith('/v1/admin')
                ? 'Admin'
                : path.startsWith('/v1/doctor-portal')
                    ? 'Doctor'
                    : undefined;

        Object.values(operations).forEach(
            operation => {

                if (
                    tag &&
                    operation &&
                    typeof operation === 'object' &&
                    !Array.isArray(operation)
                ) {
                    operation.tags = [tag];
                }

            }
        );
    }
);


module.exports = swaggerDefinition;