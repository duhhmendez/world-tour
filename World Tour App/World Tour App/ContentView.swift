//
//  ContentView.swift
//  World Tour App
//
//  Created by Cristian Mendez on 8/4/25.
//

import SwiftUI
import CoreLocation

// MARK: - Location Manager
class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    
    @Published var isLocationEnabled = false
    @Published var currentLocation: CLLocation?
    @Published var activePOI: MockPOI?
    @Published var isMonitoring = false
    
    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
    }
    
    func requestLocationPermission() {
        locationManager.requestWhenInUseAuthorization()
    }
    
    func startLocationTracking() {
        locationManager.startUpdatingLocation()
        startRegionMonitoring()
        isMonitoring = true
    }
    
    func stopLocationTracking() {
        locationManager.stopUpdatingLocation()
        stopRegionMonitoring()
        isMonitoring = false
        activePOI = nil
    }
    
    private func startRegionMonitoring() {
        for poi in mockPOIs {
            let region = CLCircularRegion(
                center: poi.coordinate,
                radius: poi.radius,
                identifier: poi.id
            )
            region.notifyOnEntry = true
            region.notifyOnExit = true
            locationManager.startMonitoring(for: region)
        }
    }
    
    private func stopRegionMonitoring() {
        for region in locationManager.monitoredRegions {
            locationManager.stopMonitoring(for: region)
        }
    }
    
    // MARK: - CLLocationManagerDelegate
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        currentLocation = location
    }
    
    func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion) {
        DispatchQueue.main.async {
            if let poi = mockPOIs.first(where: { $0.id == region.identifier }) {
                self.activePOI = poi
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didExitRegion region: CLRegion) {
        DispatchQueue.main.async {
            if self.activePOI?.id == region.identifier {
                self.activePOI = nil
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        DispatchQueue.main.async {
            self.isLocationEnabled = status == .authorizedWhenInUse || status == .authorizedAlways
        }
    }
}

// MARK: - Mock POI Data
struct MockPOI: Identifiable, Equatable {
    let id: String
    let title: String
    let description: String
    let coordinate: CLLocationCoordinate2D
    let radius: CLLocationDistance
    
    static func == (lhs: MockPOI, rhs: MockPOI) -> Bool {
        lhs.id == rhs.id
    }
}

let mockPOIs = [
    MockPOI(
        id: "empire-state",
        title: "Empire State Building",
        description: "Standing 1,454 feet tall, the Empire State Building is an Art Deco masterpiece and one of New York's most iconic landmarks.",
        coordinate: CLLocationCoordinate2D(latitude: 40.7484, longitude: -73.9857),
        radius: 50
    ),
    MockPOI(
        id: "central-park",
        title: "Central Park",
        description: "A vast urban oasis covering 843 acres, Central Park offers lakes, walking trails, and cultural landmarks in the heart of Manhattan.",
        coordinate: CLLocationCoordinate2D(latitude: 40.7829, longitude: -73.9654),
        radius: 100
    ),
    MockPOI(
        id: "times-square",
        title: "Times Square",
        description: "The bustling heart of Manhattan, Times Square is known for its bright lights, entertainment, and as the crossroads of the world.",
        coordinate: CLLocationCoordinate2D(latitude: 40.7580, longitude: -73.9855),
        radius: 75
    )
]

// MARK: - Loading Screen
struct LoadingView: View {
    @State private var isAnimating = false
    
    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                gradient: Gradient(colors: [Color.blue.opacity(0.2), Color.orange.opacity(0.1)]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 30) {
                // Animated logo
                Image(systemName: "globe")
                    .font(.system(size: 100))
                    .foregroundColor(.blue)
                    .scaleEffect(isAnimating ? 1.1 : 1.0)
                    .animation(
                        Animation.easeInOut(duration: 2.0)
                            .repeatForever(autoreverses: true),
                        value: isAnimating
                    )
                
                // App name with fade-in animation
                Text("World Tour")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                    .opacity(isAnimating ? 1.0 : 0.0)
                    .animation(
                        Animation.easeIn(duration: 1.0)
                            .delay(0.5),
                        value: isAnimating
                    )
                
                // Loading indicator
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .blue))
                    .scaleEffect(1.2)
                    .opacity(isAnimating ? 1.0 : 0.0)
                    .animation(
                        Animation.easeIn(duration: 1.0)
                            .delay(1.0),
                        value: isAnimating
                    )
            }
        }
        .onAppear {
            isAnimating = true
        }
    }
}

// MARK: - Data Models
struct POI {
    let id = UUID()
    let title: String
    let description: String
    let audioLength: TimeInterval
    let location: String
}

enum VoiceGender: String, CaseIterable {
    case male = "Male"
    case female = "Female"
    case neutral = "Neutral"
}

enum VoiceTone: String, CaseIterable {
    case friendly = "Friendly"
    case dramatic = "Dramatic"
    case playful = "Playful"
}

class TourViewModel: ObservableObject {
    @Published var currentPOIIndex = 0
    @Published var isPlaying = false
    @Published var currentTime: TimeInterval = 0
    
    let pois: [POI] = [
        POI(title: "Brooklyn Bridge", description: "An iconic suspension bridge spanning the East River, connecting Manhattan and Brooklyn.", audioLength: 180, location: "New York, NY"),
        POI(title: "Central Park", description: "A vast urban oasis featuring lakes, walking trails, and cultural landmarks.", audioLength: 240, location: "New York, NY"),
        POI(title: "Times Square", description: "The bustling heart of Manhattan, known for its bright lights and entertainment.", audioLength: 150, location: "New York, NY"),
        POI(title: "Statue of Liberty", description: "A symbol of freedom and democracy, standing proudly in New York Harbor.", audioLength: 200, location: "New York, NY"),
        POI(title: "Empire State Building", description: "An Art Deco skyscraper that was once the world's tallest building.", audioLength: 160, location: "New York, NY")
    ]
    
    var currentPOI: POI {
        pois[currentPOIIndex]
    }
    
    func nextPOI() {
        currentPOIIndex = (currentPOIIndex + 1) % pois.count
        currentTime = 0
        isPlaying = false
    }
    
    func previousPOI() {
        currentPOIIndex = currentPOIIndex == 0 ? pois.count - 1 : currentPOIIndex - 1
        currentTime = 0
        isPlaying = false
    }
    
    func togglePlayback() {
        isPlaying.toggle()
    }
}

// MARK: - Home View
struct HomeView: View {
    @StateObject private var locationManager = LocationManager()
    @State private var showingSettings = false
    
    var body: some View {
        NavigationView {
            ZStack {
                // Background gradient
                LinearGradient(
                    gradient: Gradient(colors: [Color.blue.opacity(0.1), Color.orange.opacity(0.1)]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 40) {
                    Spacer()
                    
                    // App Logo/Title
                    VStack(spacing: 20) {
                        Image(systemName: "globe")
                            .font(.system(size: 80))
                            .foregroundColor(.blue)
                        
                        Text("World Tour")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(.primary)
                    }
                    
                    // Location Status
                    if locationManager.isMonitoring {
                        VStack(spacing: 8) {
                            HStack {
                                Image(systemName: "location.fill")
                                    .foregroundColor(.green)
                                Text("Monitoring \(mockPOIs.count) locations")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                            
                            if let activePOI = locationManager.activePOI {
                                VStack(spacing: 4) {
                                    Text("Nearby: \(activePOI.title)")
                                        .font(.caption)
                                        .foregroundColor(.blue)
                                    Text("Tap to start tour")
                                        .font(.caption2)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                        .padding(.horizontal, 20)
                        .padding(.vertical, 10)
                        .background(Color(.systemGray6))
                        .cornerRadius(10)
                    }
                    
                    Spacer()
                    
                    // Start Tour Button
                    Button(action: {
                        if !locationManager.isLocationEnabled {
                            locationManager.requestLocationPermission()
                        } else {
                            locationManager.startLocationTracking()
                            NotificationCenter.default.post(name: .startTour, object: nil)
                        }
                    }) {
                        HStack {
                            Image(systemName: locationManager.isLocationEnabled ? "headphones" : "location.fill")
                                .font(.title2)
                            Text(locationManager.isLocationEnabled ? "Start Tour" : "Enable Location")
                                .font(.title2)
                                .fontWeight(.semibold)
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 60)
                        .background(
                            LinearGradient(
                                gradient: Gradient(colors: [.blue, .blue.opacity(0.8)]),
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(15)
                        .shadow(color: .blue.opacity(0.3), radius: 10, x: 0, y: 5)
                    }
                    .padding(.horizontal, 40)
                    
                    // Subtitle
                    Text(locationManager.isLocationEnabled ? "Connect your headphones and start walking—World Tour will guide you." : "Enable location to discover nearby landmarks")
                        .font(.body)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 40)
                    
                    Spacer()
                }
                
                // Settings Button
                VStack {
                    HStack {
                        Spacer()
                        Button(action: {
                            showingSettings = true
                        }) {
                            Image(systemName: "gearshape.fill")
                                .font(.title2)
                                .foregroundColor(.primary)
                                .frame(width: 44, height: 44)
                                .background(Color.secondary.opacity(0.1))
                                .clipShape(Circle())
                        }
                        .padding(.trailing, 20)
                    }
                    Spacer()
                }
            }
        }
        .sheet(isPresented: $showingSettings) {
            SettingsView()
                .background(
                    LinearGradient(
                        gradient: Gradient(colors: [Color.blue.opacity(0.1), Color.orange.opacity(0.1)]),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                    .ignoresSafeArea()
                )
        }
    }
}

// MARK: - Active Tour View
struct ActiveTourView: View {
    @StateObject private var viewModel = TourViewModel()
    @StateObject private var locationManager = LocationManager()
    @Environment(\.dismiss) private var dismiss
    @State private var currentTitleIndex = 0
    @State private var isAnimating = false
    @State private var titleTimer: Timer?
    
    // Dummy titles for nearby tours
    let nearbyTitles = [
        "Empire State Building",
        "Central Park",
        "Times Square",
        "Brooklyn Bridge",
        "Statue of Liberty"
    ]
    
    var body: some View {
        NavigationView {
            ZStack {
                // Background
                LinearGradient(
                    gradient: Gradient(colors: [Color.blue.opacity(0.05), Color.orange.opacity(0.05)]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Current POI Info - Simplified
                    VStack(spacing: 20) {
                        // Animated POI Title with Hello animation
                        VStack(spacing: 8) {
                            Text(getCurrentTitle())
                                .font(.largeTitle)
                                .fontWeight(.bold)
                                .foregroundColor(.primary)
                                .multilineTextAlignment(.center)
                                .opacity(isAnimating ? 1.0 : 0.0)
                                .scaleEffect(isAnimating ? 1.0 : 0.8)
                                .animation(.easeInOut(duration: 0.8), value: isAnimating)
                            
                            // Subtle subtitle animation
                            Text("New York, NY")
                                .font(.title3)
                                .foregroundColor(.secondary)
                                .opacity(isAnimating ? 1.0 : 0.0)
                                .animation(.easeInOut(duration: 0.8).delay(0.2), value: isAnimating)
                        }
                    }
                    .padding(.top, 60)
                    
                    Spacer()
                    
                    // Audio Controls - Moved to bottom
                    VStack(spacing: 30) {
                        // Progress Bar
                        VStack(spacing: 12) {
                            ProgressView(value: viewModel.currentTime, total: viewModel.currentPOI.audioLength)
                                .progressViewStyle(LinearProgressViewStyle(tint: .blue))
                                .scaleEffect(x: 1, y: 2, anchor: .center)
                            
                            HStack {
                                Text(formatTime(viewModel.currentTime))
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                
                                Spacer()
                                
                                Text(formatTime(viewModel.currentPOI.audioLength))
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }
                        .padding(.horizontal, 40)
                        
                        // Playback Controls
                        HStack(spacing: 50) {
                            // Previous Button
                            Button(action: {
                                viewModel.previousPOI()
                            }) {
                                Image(systemName: "backward.fill")
                                    .font(.title2)
                                    .foregroundColor(.primary)
                                    .frame(width: 50, height: 50)
                                    .background(Color.secondary.opacity(0.1))
                                    .clipShape(Circle())
                            }
                            
                            // Play/Pause Button
                            Button(action: {
                                viewModel.togglePlayback()
                            }) {
                                Image(systemName: viewModel.isPlaying ? "pause.fill" : "play.fill")
                                    .font(.system(size: 35))
                                    .foregroundColor(.white)
                                    .frame(width: 70, height: 70)
                                    .background(
                                        LinearGradient(
                                            gradient: Gradient(colors: [.blue, .blue.opacity(0.8)]),
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                    .clipShape(Circle())
                                    .shadow(color: .blue.opacity(0.3), radius: 8, x: 0, y: 4)
                            }
                            
                            // Next Button
                            Button(action: {
                                viewModel.nextPOI()
                            }) {
                                Image(systemName: "forward.fill")
                                    .font(.title2)
                                    .foregroundColor(.primary)
                                    .frame(width: 50, height: 50)
                                    .background(Color.secondary.opacity(0.1))
                                    .clipShape(Circle())
                            }
                        }
                    }
                    .padding(.bottom, 60)
                }
            }
            .navigationTitle("Active Tour")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("End Tour") {
                        dismiss()
                    }
                    .foregroundColor(.red)
                }
            }
        }
        .onAppear {
            // Start Hello animation
            startTitleAnimation()
            
            // Simulate progress when playing
            if viewModel.isPlaying {
                startProgressSimulation()
            }
        }
        .onChange(of: viewModel.isPlaying) { isPlaying in
            if isPlaying {
                startProgressSimulation()
                stopTitleAnimation()
            } else {
                // Restart animation when paused
                startTitleAnimation()
            }
        }
        .onChange(of: locationManager.activePOI) { activePOI in
            if activePOI != nil {
                stopTitleAnimation()
            } else if !viewModel.isPlaying {
                startTitleAnimation()
            }
        }
    }
    
    private func startProgressSimulation() {
        Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            if viewModel.isPlaying && viewModel.currentTime < viewModel.currentPOI.audioLength {
                viewModel.currentTime += 1
            } else if viewModel.currentTime >= viewModel.currentPOI.audioLength {
                viewModel.isPlaying = false
                timer.invalidate()
            }
        }
    }
    
    private func startTitleAnimation() {
        // Initial animation
        withAnimation(.easeInOut(duration: 0.8)) {
            isAnimating = true
        }
        
        // Cycle through titles every 3 seconds
        titleTimer = Timer.scheduledTimer(withTimeInterval: 3.0, repeats: true) { timer in
            withAnimation(.easeInOut(duration: 0.5)) {
                isAnimating = false
            }
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                currentTitleIndex = (currentTitleIndex + 1) % nearbyTitles.count
                
                withAnimation(.easeInOut(duration: 0.8)) {
                    isAnimating = true
                }
            }
        }
    }
    
    private func stopTitleAnimation() {
        titleTimer?.invalidate()
        titleTimer = nil
        
        // Ensure title is visible when playing starts
        withAnimation(.easeInOut(duration: 0.5)) {
            isAnimating = true
        }
    }
    
    private func getCurrentTitle() -> String {
        if let activePOI = locationManager.activePOI {
            return activePOI.title
        } else if viewModel.isPlaying {
            return viewModel.currentPOI.title
        } else {
            return nearbyTitles[currentTitleIndex]
        }
    }
    
    private func formatTime(_ timeInterval: TimeInterval) -> String {
        let minutes = Int(timeInterval) / 60
        let seconds = Int(timeInterval) % 60
        return String(format: "%d:%02d", minutes, seconds)
    }
}

// MARK: - Settings View
struct SettingsView: View {
    @AppStorage("voiceGender") private var voiceGender: VoiceGender = .neutral
    @AppStorage("voiceTone") private var voiceTone: VoiceTone = .friendly
    @AppStorage("backgroundAmbience") private var backgroundAmbience: Bool = true
    @AppStorage("offlineMode") private var offlineMode: Bool = false
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ZStack {
                // Background - removed to use sheet background
                Color.clear
                    .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Settings List
                    List {
                        Section {
                            HStack {
                                Image(systemName: "person.wave.2")
                                    .foregroundColor(.blue)
                                    .frame(width: 30)
                                
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Voice Gender")
                                        .font(.body)
                                        .fontWeight(.medium)
                                    Text("Choose the voice for audio guides")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                
                                Spacer()
                                
                                Picker("", selection: $voiceGender) {
                                    ForEach(VoiceGender.allCases, id: \.self) { gender in
                                        Text(gender.rawValue.capitalized).tag(gender)
                                    }
                                }
                                .pickerStyle(MenuPickerStyle())
                            }
                            .padding(.vertical, 4)
                            
                            HStack {
                                Image(systemName: "speaker.wave.3")
                                    .foregroundColor(.blue)
                                    .frame(width: 30)
                                
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Voice Tone")
                                        .font(.body)
                                        .fontWeight(.medium)
                                    Text("Select the tone of voice narration")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                
                                Spacer()
                                
                                Picker("", selection: $voiceTone) {
                                    ForEach(VoiceTone.allCases, id: \.self) { tone in
                                        Text(tone.rawValue.capitalized).tag(tone)
                                    }
                                }
                                .pickerStyle(MenuPickerStyle())
                            }
                            .padding(.vertical, 4)
                        } header: {
                            Text("Voice Settings")
                                .font(.headline)
                                .fontWeight(.semibold)
                                .foregroundColor(.primary)
                                .textCase(nil)
                        }
                        
                        Section {
                            HStack {
                                Image(systemName: "speaker.wave.2")
                                    .foregroundColor(.blue)
                                    .frame(width: 30)
                                
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Background Ambience")
                                        .font(.body)
                                        .fontWeight(.medium)
                                    Text("Play ambient sounds during tours")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                
                                Spacer()
                                
                                Toggle("Background Ambience", isOn: $backgroundAmbience)
                                    .labelsHidden()
                            }
                            .padding(.vertical, 4)
                        } header: {
                            Text("Audio Settings")
                                .font(.headline)
                                .fontWeight(.semibold)
                                .foregroundColor(.primary)
                                .textCase(nil)
                        }
                        
                        Section {
                            HStack {
                                Image(systemName: "icloud.slash")
                                    .foregroundColor(.blue)
                                    .frame(width: 30)
                                
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Offline Mode")
                                        .font(.body)
                                        .fontWeight(.medium)
                                    Text("Use downloaded content only")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                
                                Spacer()
                                
                                Toggle("Offline Mode", isOn: $offlineMode)
                                    .labelsHidden()
                            }
                            .padding(.vertical, 4)
                        } header: {
                            Text("App Settings")
                                .font(.headline)
                                .fontWeight(.semibold)
                                .foregroundColor(.primary)
                                .textCase(nil)
                        }
                        
                        Section {
                            HStack {
                                Image(systemName: "info.circle")
                                    .foregroundColor(.blue)
                                    .frame(width: 30)
                                
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Version")
                                        .font(.body)
                                        .fontWeight(.medium)
                                    Text("1.0.0")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                
                                Spacer()
                            }
                            .padding(.vertical, 4)
                        } header: {
                            Text("About")
                                .font(.headline)
                                .fontWeight(.semibold)
                                .foregroundColor(.primary)
                                .textCase(nil)
                        }
                    }
                    .listStyle(InsetGroupedListStyle())
                    .background(Color.clear)
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

// MARK: - Past Tours View
struct PastToursView: View {
    // Mock data for past tours
    let pastTours = [
        TourTranscript(title: "Brooklyn Bridge Walk", date: "Today", duration: "3:45", location: "New York, NY", transcript: "Welcome to the Brooklyn Bridge, an iconic suspension bridge spanning the East River. Completed in 1883, this engineering marvel connects Manhattan and Brooklyn..."),
        TourTranscript(title: "Central Park Discovery", date: "Yesterday", duration: "4:12", location: "New York, NY", transcript: "Step into Central Park, a vast urban oasis covering 843 acres. This green sanctuary offers lakes, walking trails, and cultural landmarks..."),
        TourTranscript(title: "Times Square Experience", date: "2 days ago", duration: "2:58", location: "New York, NY", transcript: "Welcome to Times Square, the bustling heart of Manhattan. Known for its bright lights and entertainment, this iconic intersection..."),
        TourTranscript(title: "Statue of Liberty Tour", date: "3 days ago", duration: "3:20", location: "New York, NY", transcript: "Standing proudly in New York Harbor, the Statue of Liberty is a symbol of freedom and democracy. This colossal neoclassical sculpture..."),
        TourTranscript(title: "Empire State Building", date: "1 week ago", duration: "2:45", location: "New York, NY", transcript: "Rising 1,454 feet above Manhattan, the Empire State Building is an Art Deco masterpiece. Once the world's tallest building...")
    ]
    
    var body: some View {
        NavigationView {
            ScrollView {
                LazyVStack(spacing: 16) {
                    if pastTours.isEmpty {
                        // Empty state
                        VStack(spacing: 30) {
                            Spacer()
                            
                            Image(systemName: "headphones")
                                .font(.system(size: 60))
                                .foregroundColor(.secondary)
                            
                            Text("No Past Tours")
                                .font(.title2)
                                .fontWeight(.semibold)
                                .foregroundColor(.primary)
                            
                            Text("Your completed tours will appear here")
                                .font(.body)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, 40)
                            
                            Spacer()
                        }
                        .frame(maxWidth: .infinity, minHeight: 400)
                    } else {
                        // Tours list with Health app style
                        ForEach(pastTours, id: \.id) { tour in
                            HealthStyleTourCard(tour: tour)
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Past Tours")
            .navigationBarTitleDisplayMode(.large)
        }
    }
}

// MARK: - Tour Transcript Model
struct TourTranscript {
    let id = UUID()
    let title: String
    let date: String
    let duration: String
    let location: String
    let transcript: String
}

// MARK: - Health Style Tour Card
struct HealthStyleTourCard: View {
    let tour: TourTranscript
    @State private var showingTranscript = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Main card content
            VStack(alignment: .leading, spacing: 12) {
                // Header with icon and title
                HStack(spacing: 12) {
                    // Tour icon
                    ZStack {
                        Circle()
                            .fill(LinearGradient(
                                gradient: Gradient(colors: [.blue, .blue.opacity(0.8)]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ))
                            .frame(width: 44, height: 44)
                        
                        Image(systemName: "headphones")
                            .font(.system(size: 20, weight: .medium))
                            .foregroundColor(.white)
                    }
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text(tour.title)
                            .font(.headline)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                        
                        Text(tour.date)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                    
                    // Duration badge
                    Text(tour.duration)
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundColor(.blue)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.blue.opacity(0.1))
                        .cornerRadius(8)
                }
                
                // Location info
                HStack(spacing: 8) {
                    Image(systemName: "location.fill")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Text(tour.location)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            .padding(16)
            
            // View Transcript button (Health app style)
            Button(action: {
                showingTranscript = true
            }) {
                HStack {
                    Text("View Transcript")
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(.blue)
                    
                    Spacer()
                    
                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundColor(.blue)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color(.systemGray6))
            }
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
        .sheet(isPresented: $showingTranscript) {
            TranscriptDetailView(tour: tour)
                .background(
                    LinearGradient(
                        gradient: Gradient(colors: [Color.blue.opacity(0.1), Color.orange.opacity(0.1)]),
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                    .ignoresSafeArea()
                )
        }
    }
}

// MARK: - Transcript Detail View
struct TranscriptDetailView: View {
    let tour: TourTranscript
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Header section
                    VStack(alignment: .leading, spacing: 16) {
                        // Tour icon and title
                        HStack(spacing: 16) {
                            ZStack {
                                Circle()
                                    .fill(LinearGradient(
                                        gradient: Gradient(colors: [.blue, .blue.opacity(0.8)]),
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    ))
                                    .frame(width: 60, height: 60)
                                
                                Image(systemName: "headphones")
                                    .font(.system(size: 28, weight: .medium))
                                    .foregroundColor(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text(tour.title)
                                    .font(.title2)
                                    .fontWeight(.bold)
                                    .foregroundColor(.primary)
                                
                                Text(tour.date)
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                        }
                        
                        // Tour details
                        VStack(alignment: .leading, spacing: 12) {
                            HStack(spacing: 16) {
                                Label(tour.duration, systemImage: "clock")
                                Label(tour.location, systemImage: "location")
                            }
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 20)
                    
                    // Transcript content
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Transcript")
                            .font(.headline)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                        
                        Text(tour.transcript)
                            .font(.body)
                            .foregroundColor(.primary)
                            .lineSpacing(4)
                    }
                    .padding(.horizontal, 20)
                    
                    Spacer(minLength: 40)
                }
            }
            .background(Color.clear)
            .navigationTitle("Transcript")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .foregroundColor(.blue)
                }
            }
        }
    }
}

// MARK: - Main Content View
struct ContentView: View {
    @State private var showingActiveTour = false
    @State private var isLoading = true
    
    var body: some View {
        ZStack {
            if isLoading {
                LoadingView()
                    .onAppear {
                        // Simulate loading time
                        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                            withAnimation(.easeInOut(duration: 0.5)) {
                                isLoading = false
                            }
                        }
                    }
            } else {
                TabView {
                    // Home Tab
                    HomeView()
                        .tabItem {
                            Image(systemName: "house.fill")
                            Text("Home")
                        }
                        .onReceive(NotificationCenter.default.publisher(for: .startTour)) { _ in
                            showingActiveTour = true
                        }
                    
                    // Past Tours Tab
                    PastToursView()
                        .tabItem {
                            Image(systemName: "list.bullet.clipboard.fill")
                            Text("Past Tours")
                        }
                }
                .accentColor(.blue)
                .fullScreenCover(isPresented: $showingActiveTour) {
                    ActiveTourView()
                }
            }
        }
    }
}

// MARK: - Extensions
extension Notification.Name {
    static let startTour = Notification.Name("startTour")
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .previewDevice("iPhone 14")
            .preferredColorScheme(.dark)
    }
}
