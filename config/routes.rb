Rails.application.routes.draw do

  root "jobs#index"
  resources :jobs do
    resources :tenders, only: [:create, :update]
    resources :ratings, only: [:create, :new]
  end
  resources :sessions, only: [:create, :destroy]
  resources :users do
    resources :tenders, only: [:index]
    resources :jobs, only: [:index]
  end  
end
