<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JobCircularController;
use App\Services\Email\EmailService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function (EmailService $emailService) {
    $result = $emailService->fetchApplicationEmails();

    return Inertia::render('welcome', [
        'emailResult' => $result,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get(
        '/dashboard',
        [DashboardController::class, 'index']
    )->name('dashboard');

    Route::resource(
        'jobs',
        JobCircularController::class
    );

    Route::resource(
        'applications',
        ApplicationController::class
    );

    Route::patch(
        '/applications/{application}/status',
        [ApplicationController::class, 'updateStatus']
    )->name('applications.update-status');

    Route::post(
        '/applications/{application}/reprocess',
        [ApplicationController::class, 'reprocess']
    )->name('applications.reprocess');

    Route::resource(
        'candidates',
        CandidateController::class
    );

    Route::get(
        '/candidates/{candidate}/resume',
        [CandidateController::class, 'resume']
    )->name('candidates.resume');
});

require __DIR__ . '/settings.php';
