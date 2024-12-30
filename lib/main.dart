import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:video_stream/camera.dart';
import 'package:flutter_live_stream_mux/firebase_options.dart';
import 'package:flutter_live_stream_mux/screens/dashboard_page.dart';

// Global variable for storing the list of available cameras
List<CameraDescription> cameras = [];

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // Get the available device cameras
  try {
    cameras = await availableCameras();
  } on CameraException catch (e) {
    debugPrint(e.toString());
  }

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Live Stream',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.pink,
      ),
      home: const DashboardPage(),
    );
  }
}
