class SessionsController < ApplicationController

  def new
    #render text: "good work old bot"
  end

  def index
    if User.exists?(session[:user_id])
      render text: "session id = #{session[:user_id]}"
    else
      session[:user_id] = nil
      render text: "no user session"
    end
  end

  def create
    @user = User.find_by_email(params[:email])
    if @user
      if @user.password == params[:password]
        session[:user_id] = @user.id
        session[:expires_at] = Time.current + 1.hours
        render json: {message:"you logged in"}
      else
        session[:user_id] = nil
        render json: {message:"password incorrect"}, status: :unauthorized
      end
    else
      session[:user_id] = nil
      render json: {message:"user not found"}, status: :unauthorized
    end

  end

  def user_exists
    if User.exists?(session[:user_id])
      true
    else
      session[:user_id] = nil
      false
    end
  end

  def destroy
    if session[:user_id]
      session[:user_id] = nil
      redirect_to '/jobs', notice: "user logged out"
    end
  end

end
